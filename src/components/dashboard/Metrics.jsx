import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDishes, getCategories, getUsers, getOrders } from "../../https/Index";

const Metrics = () => {
  // queries
  const { data: dishesRes } = useQuery({ queryKey: ["dishes"], queryFn: getDishes, staleTime: 1000 * 60 * 5 });
  const { data: catsRes } = useQuery({ queryKey: ["categories"], queryFn: getCategories, staleTime: 1000 * 60 * 5 });
  const { data: usersRes } = useQuery({ queryKey: ["users"], queryFn: getUsers, staleTime: 1000 * 60 * 5 });
  const { data: ordersRes } = useQuery({ queryKey: ["orders", "metrics"], queryFn: getOrders, staleTime: 1000 * 60 * 1 });

  const products = dishesRes?.data?.data || dishesRes?.data || [];
  const categories = catsRes?.data || [];
  const users = usersRes?.data || [];
  const orders = ordersRes?.data?.data || ordersRes?.data || [];

  const outOfStock = useMemo(() => products.filter(p => (p.stock || p.quantity || 0) < 1), [products]);
  const categoryCount = categories.length;
  const adminAccounts = users.filter(u => u.is_superadmin || u.is_admin);
  const customerAccounts = users.filter(u => !u.is_admin && !u.is_superadmin);

  const now = new Date();
  const dayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  const todaysOrders = orders.filter(o => {
    const d = new Date(o.createdAt || o.dateTime || o.timestamp || o.orderDate || o.created_at || now);
    return d >= dayAgo && d <= now;
  });
  const completedToday = todaysOrders.filter(o => ((o.status || o.orderStatus || "").toString().toLowerCase() === "completed") || ((o.status || o.orderStatus || "").toString().toLowerCase() === "ready"));
  const dailyCompletePct = todaysOrders.length ? Math.round((completedToday.length / todaysOrders.length) * 100) : 0;

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlySales = orders.reduce((sum, o) => {
    const d = new Date(o.createdAt || o.dateTime || o.timestamp || o.orderDate || o.created_at || now);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      return sum + (Number(o.total) || Number(o.bills?.totalWithTax) || 0);
    }
    return sum;
  }, 0);

  const days = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(now.getDate() - (29 - i));
    return date;
  });

  const last30Sales = days.map((d) => {
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    const total = orders.reduce((s, o) => {
      const dt = new Date(o.createdAt || o.dateTime || o.timestamp || o.orderDate || o.created_at || now);
      if (dt >= dayStart && dt < dayEnd) return s + (Number(o.total) || Number(o.bills?.totalWithTax) || 0);
      return s;
    }, 0);
    return { date: dayStart, total };
  });

  const productTotals = {};
  orders.forEach(o => {
    const items = Array.isArray(o.items) ? o.items : Array.isArray(o.orderItems) ? o.orderItems : [];
    items.forEach(it => {
      const id = it.id || it.itemId || it._id || it.menuId || it.name;
      const qty = Number(it.quantity || it.qty || it.count || 1) || 1;
      const name = it.name || it.itemName || it.productName || "Item";
      if (!productTotals[id]) productTotals[id] = { name, qty: 0 };
      productTotals[id].qty += qty;
    })
  });

  const topProducts = Object.values(productTotals).sort((a, b) => b.qty - a.qty).slice(0, 3);

  const LineChart = ({ data }) => {
    const max = Math.max(...data.map(d => d.total), 1);
    const points = data.map((d, i) => `${(i / (data.length-1)) * 100},${100 - (d.total / max) * 100}`).join(' ');
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="chart-svg">
        <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth="0.8" />
      </svg>
    )
  };

  const PieChart = ({ items }) => {
    const total = items.reduce((s, it) => s + it.qty, 0) || 1;
    let cumulative = 0;
    const center = 50;
    const r = 30;
    return (
      <svg viewBox="0 0 100 100" className="pie-chart">
        {items.map((it, idx) => {
          const start = (cumulative / total) * Math.PI * 2;
          cumulative += it.qty;
          const end = (cumulative / total) * Math.PI * 2;
          const x1 = center + r * Math.cos(start - Math.PI/2);
          const y1 = center + r * Math.sin(start - Math.PI/2);
          const x2 = center + r * Math.cos(end - Math.PI/2);
          const y2 = center + r * Math.sin(end - Math.PI/2);
          const large = end - start > Math.PI ? 1 : 0;
          const path = `M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
          const colors = ["var(--primary)", "#16a34a", "#eab308"];
          return <path key={idx} d={path} fill={colors[idx % colors.length]} />;
        })}
      </svg>
    )
  };

  return (
    <div className="metrics-container">
      <div className="metrics-content">
        {/* Header */}
        <div className="metrics-header">
          <div>
            <h2 className="metrics-title">Superadmin Dashboard</h2>
            <p className="metrics-subtitle">Summary & KPIs for the last 30 days</p>
          </div>
        </div>

        {/* Top metric cards */}
        <div className="metrics-grid">
          <div className="metric-card stock-card">
            <div className="metric-content">
              <p className="metric-label">Out-of-stock items</p>
              <div className="metric-value">{outOfStock.length}</div>
              <div className="metric-details">
                {outOfStock.slice(0,3).map(p => p.name || p.title).join(', ')}
                {outOfStock.length > 3 && ` +${outOfStock.length - 3} more`}
              </div>
            </div>
            <div className="metric-icon">📦</div>
          </div>

          <div className="metric-card categories-card">
            <div className="metric-content">
              <p className="metric-label">Categories</p>
              <div className="metric-value">{categoryCount}</div>
              <div className="metric-details">Active menu categories</div>
            </div>
            <div className="metric-icon">📑</div>
          </div>

          <div className="metric-card orders-card">
            <div className="metric-content">
              <p className="metric-label">Daily completed orders</p>
              <div className="metric-value">{dailyCompletePct}%</div>
              <div className="metric-details">Completed (24h)</div>
            </div>
            <div className="metric-icon">✅</div>
          </div>

          <div className="metric-card sales-card">
            <div className="metric-content">
              <p className="metric-label">Monthly sales</p>
              <div className="metric-value">KSH {monthlySales.toLocaleString()}</div>
              <div className="metric-details">Current month</div>
            </div>
            <div className="metric-icon">💰</div>
          </div>
        </div>

        {/* Charts + admin/customer lists */}
        <div className="charts-section">
          <div className="chart-container">
            <div className="chart-card">
              <h3 className="chart-title">Daily Sales (last 30 days)</h3>
              <div className="chart-wrapper">
                <LineChart data={last30Sales} />
              </div>
              <div className="chart-footer">
                Total (30d): KSH {last30Sales.reduce((s,d)=>s+d.total,0).toLocaleString()}
              </div>

              <div className="top-products-grid">
                {topProducts.map((p, idx) => (
                  <div key={idx} className="product-card">
                    <div className="product-rank">Top {idx+1}</div>
                    <div className="product-name">{p.name}</div>
                    <div className="product-quantity">Qty: {p.qty.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sidebar-container">
            <div className="sidebar-card">
              <h3 className="sidebar-title">Top products (by quantity)</h3>
              <div className="pie-chart-container">
                <PieChart items={topProducts} />
                <div className="product-list">
                  {topProducts.map((t, i) => (
                    <div key={i} className="product-item">
                      <div className="product-name">{t.name}</div>
                      <div className="product-sales">{t.qty.toLocaleString()} sold</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="users-section">
                <div className="users-group">
                  <h4 className="users-title">Admins</h4>
                  <div className="users-list">
                    {adminAccounts.slice(0,5).map((a) => (
                      <div key={a.id || a._id} className="user-item">
                        <div className="user-name">
                          {(a.first_name || a.username) + (a.last_name ? ' '+a.last_name : '')}
                        </div>
                        <div className="user-email">{a.email}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="users-group">
                  <h4 className="users-title">Customers</h4>
                  <div className="users-list">
                    {customerAccounts.slice(0,5).map((c) => (
                      <div key={c.id || c._id} className="user-item">
                        <div className="user-name">
                          {(c.first_name || c.username) + (c.last_name ? ' '+c.last_name : '')}
                        </div>
                        <div className="user-email">{c.email}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .metrics-container {
          padding: 1.5rem;
          font-family: 'Inter', sans-serif;
          background: var(--bg-body);
          min-height: 100vh;
        }

        .metrics-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header */
        .metrics-header {
          margin-bottom: 2rem;
        }

        .metrics-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .metrics-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .stock-card {
          border-left: 4px solid #ef4444;
        }

        .categories-card {
          border-left: 4px solid var(--primary);
        }

        .orders-card {
          border-left: 4px solid #eab308;
        }

        .sales-card {
          border-left: 4px solid #16a34a;
        }

        .metric-content {
          flex: 1;
        }

        .metric-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          color: var(--text-primary);
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .metric-details {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin: 0;
        }

        .metric-icon {
          font-size: 2rem;
          opacity: 0.8;
        }

        /* Charts Section */
        .charts-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        .chart-card, .sidebar-card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
        }

        .chart-title, .sidebar-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 1.5rem 0;
        }

        .chart-wrapper {
          background: #f8f9ff;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .chart-svg {
          width: 100%;
          height: 160px;
          border-radius: 8px;
        }

        .chart-footer {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }

        /* Top Products */
        .top-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .product-card {
          background: #f8f9ff;
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
        }

        .product-rank {
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .product-name {
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .product-quantity {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }

        /* Pie Chart */
        .pie-chart-container {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .pie-chart {
          width: 120px;
          height: 120px;
          flex-shrink: 0;
        }

        .product-list {
          flex: 1;
        }

        .product-item {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .product-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .product-name {
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
        }

        .product-sales {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }

        /* Users Section */
        .users-section {
          margin-top: 2rem;
        }

        .users-group {
          margin-bottom: 1.5rem;
        }

        .users-group:last-child {
          margin-bottom: 0;
        }

        .users-title {
          color: var(--text-primary);
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
        }

        .users-list {
          space-y: 0.75rem;
        }

        .user-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8f9ff;
          border-radius: 8px;
        }

        .user-name {
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .user-email {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .charts-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .metrics-container {
            padding: 1rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .metric-card {
            padding: 1.25rem;
          }

          .top-products-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .pie-chart-container {
            flex-direction: column;
            text-align: center;
          }

          .chart-card, .sidebar-card {
            padding: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .metrics-title {
            font-size: 1.5rem;
          }

          .metric-value {
            font-size: 1.75rem;
          }

          .metric-icon {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Metrics;