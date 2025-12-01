import React, { useState, useEffect } from "react";
import OrderCardNew from "../components/Orders/OrderCardNew.jsx";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders, getWebsiteOrders } from "../https/Index.js";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { selectAllOrders } from "../redux/slices/orderSlice";

const OrdersNew = () => {
  const [status, setStatus] = useState("all");
  const [showDebug, setShowDebug] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  const {
    data: resData,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    placeholderData: keepPreviousData,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
  });

  const {
    data: websiteOrdersData,
    isError: websiteError,
    isFetching: websiteFetching,
  } = useQuery({
    queryKey: ["websiteOrders"],
    queryFn: async () => await getWebsiteOrders(),
    placeholderData: keepPreviousData,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (isError) {
      console.error("Orders fetch error:", isError);
      enqueueSnackbar("Failed to load orders", { variant: "error" });
    }
  }, [isError]);

  useEffect(() => {
    if (websiteError) {
      console.error("Website orders fetch error:", websiteError);
      enqueueSnackbar("Failed to load website orders (see console)", { variant: "warning" });
    }
  }, [websiteError]);

  useEffect(() => {
    console.debug("websiteOrdersData raw:", websiteOrdersData);
  }, [websiteOrdersData]);

  const findFirstArray = (obj, depth = 0) => {
    if (!obj || depth > 4) return null;
    if (Array.isArray(obj) && obj.length > 0) return obj;
    if (typeof obj !== "object") return null;
    for (const key of Object.keys(obj)) {
      try {
        const candidate = obj[key];
        if (Array.isArray(candidate) && candidate.length > 0) return candidate;
        if (typeof candidate === "object") {
          const found = findFirstArray(candidate, depth + 1);
          if (found) return found;
        }
      } catch (e) {
        // ignore
      }
    }
    return null;
  };

  const extractOrders = (data) => {
    if (!data) return [];
    const candidates = [
      data?.data?.orders,
      data?.data?.data,
      data?.orders,
      data?.data,
      data,
    ];
    for (const candidate of candidates) {
      if (Array.isArray(candidate) && candidate.length > 0) return candidate;
    }
    const found = findFirstArray(data);
    return Array.isArray(found) ? found : [];
  };

  const orders = extractOrders(resData);
  const websiteOrders = extractOrders(websiteOrdersData);
  const localOrders = useSelector((state) => selectAllOrders(state) || []);

  const getIdFromOrder = (o) => o?._id || o?.id || o?.orderId || JSON.stringify(o.items || []);

  const mergeOrders = (() => {
    const map = new Map();
    const getId = (o) => o._id || o.id || o.orderId || JSON.stringify(o.items || []);
    (localOrders || []).forEach((o) => map.set(getId(o), o));
    (orders || []).forEach((o) => {
      const id = getId(o);
      if (!map.has(id)) map.set(id, o);
    });
    (websiteOrders || []).forEach((o) => {
      const id = getId(o);
      if (!map.has(id)) map.set(id, o);
    });
    return Array.from(map.values());
  })();

  console.log("Final Orders Count (merged):", mergeOrders.length);
  console.log("  - Local Redux orders:", localOrders?.length || 0);
  console.log("  - Server orders:", orders?.length || 0);
  console.log("  - Website orders:", websiteOrders?.length || 0);

  const normalizeStatus = (o) => {
    const raw = (o?.status || o?.orderStatus || o?.paymentStatus || "pending").toString().toLowerCase();
    // Map common backend/app synonyms to the UI categories
    if (raw === "pending" || raw === "processing" || raw === "inprogress" || raw === "in progress") return "in progress";
    if (raw === "done" || raw === "completed" || raw === "complete") return "completed";
    if (raw === "ready" || raw === "ready for pickup") return "ready";
    return raw; // default – whatever the backend returned
  };

  const getStatusCount = (targetStatus) => {
    if (targetStatus === "all") return mergeOrders.length;
    return mergeOrders.filter((o) => normalizeStatus(o) === targetStatus.toLowerCase()).length;
  };

  const filteredOrders =
    status === "all"
      ? mergeOrders
      : mergeOrders.filter((o) => normalizeStatus(o) === status.toLowerCase());

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Header */}
        <div className="orders-header">
          <div>
            <h1 className="orders-title">
              Order Management
            </h1>
            <p className="orders-subtitle">View and manage all customer orders</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="refresh-btn"
          >
            {isFetching ? (
              <>
                <div className="refresh-spinner"></div>
                Updating...
              </>
            ) : (
              "Refresh"
            )}
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {["all", "in progress", "ready", "completed"].map((s) => {
            const count = getStatusCount(s);
            const isActive = status === s;

            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`filter-btn ${isActive ? 'filter-btn-active' : 'filter-btn-inactive'} ${
                  isActive ? `filter-${s.replace(' ', '-')}` : ''
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1).replace(" progress", " Progress")} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders Grid */}
        <div className="orders-grid">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              // determine if this came from the websiteOrders list
              const isWebsite = (websiteOrders || []).some((w) => getIdFromOrder(w) === getIdFromOrder(order));
              return (
                <OrderCardNew
                  key={order._id || order.id || Math.random()}
                  order={order}
                  isWebsite={isWebsite}
                />
              );
            })
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p className="empty-title">No orders found</p>
              <p className="empty-subtitle">
                {status === "all"
                  ? "No orders yet. Start taking orders!"
                  : `No ${status} orders.`}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .orders-page {
          min-height: 100vh;
          background: var(--bg-body);
          font-family: 'Inter', sans-serif;
          padding: 2rem;
        }

        .orders-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header */
        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 2rem;
        }

        .orders-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .orders-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
          line-height: 1.5;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: var(--shadow);
          white-space: nowrap;
        }

        .refresh-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--primary-hover), var(--primary));
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(44, 85, 48, 0.3);
        }

        .refresh-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .refresh-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Filter Buttons */
        .filter-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.875rem 1.5rem;
          border: 2px solid var(--border-color);
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: var(--card-bg);
          color: var(--text-secondary);
          position: relative;
          overflow: hidden;
        }

        .filter-btn-inactive:hover {
          border-color: var(--primary-light);
          color: var(--text-primary);
          background: rgba(44, 85, 48, 0.05);
          transform: translateY(-1px);
        }

        .filter-btn-active {
          color: white;
          border-color: transparent;
          box-shadow: var(--shadow);
        }

        .filter-all.filter-btn-active {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
        }

        .filter-in-progress.filter-btn-active {
          background: linear-gradient(135deg, var(--warning), #f59e0b);
        }

        .filter-ready.filter-btn-active {
          background: linear-gradient(135deg, var(--secondary), var(--secondary-light));
        }

        .filter-completed.filter-btn-active {
          background: linear-gradient(135deg, var(--success), #10b981);
        }

        .filter-btn-active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 10px 10px 0 0;
        }

        /* Orders Grid */
        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1.5rem;
        }

        /* Loading State */
        .loading-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background: var(--card-bg);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
        }

        .loading-spinner {
          width: 3rem;
          height: 3rem;
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .loading-text {
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background: var(--card-bg);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          text-align: center;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .empty-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
          line-height: 1.5;
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .orders-grid {
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .orders-page {
            padding: 1.5rem;
          }

          .orders-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
          }

          .orders-title {
            font-size: 1.75rem;
          }

          .filter-buttons {
            gap: 0.75rem;
          }

          .filter-btn {
            padding: 0.75rem 1.25rem;
            font-size: 0.85rem;
          }

          .orders-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }

        @media (max-width: 640px) {
          .orders-page {
            padding: 1rem;
          }

          .filter-buttons {
            justify-content: center;
          }

          .filter-btn {
            flex: 1;
            min-width: 140px;
            text-align: center;
          }

          .loading-state,
          .empty-state {
            padding: 3rem 1.5rem;
          }

          .empty-icon {
            font-size: 3rem;
          }

          .empty-title {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .orders-title {
            font-size: 1.5rem;
          }

          .orders-subtitle {
            font-size: 0.9rem;
          }

          .refresh-btn {
            padding: 0.625rem 1.25rem;
            font-size: 0.85rem;
          }

          .filter-btn {
            padding: 0.625rem 1rem;
            font-size: 0.8rem;
          }
        }

        /* Focus states for accessibility */
        .refresh-btn:focus,
        .filter-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .refresh-btn,
          .filter-btn {
            transition: none;
          }

          .refresh-btn:hover:not(:disabled),
          .filter-btn-inactive:hover {
            transform: none;
          }

          .refresh-spinner,
          .loading-spinner {
            animation: none;
            border-top-color: transparent;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .filter-btn {
            border-width: 2px;
          }

          .filter-btn-active {
            border-width: 3px;
            border-color: var(--text-primary);
          }
        }
      `}</style>
    </div>
  );
};

export default OrdersNew;