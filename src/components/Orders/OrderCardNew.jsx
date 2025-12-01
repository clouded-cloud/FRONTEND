import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCart, addOrderToHistory } from "../../redux/slices/cartSlice";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { menus as seedMenus } from "../../Constants/Index";

const OrderCardNew = ({ order, isWebsite = false }) => {
  // ──────────────────────────────────────────────────────────────
  // 1. Normalize all possible data shapes
  // ──────────────────────────────────────────────────────────────
  // Normalize customer fields: `order.customer` might be a string or an object
  let customerName = "Customer";
  let customerPhone = "";

  if (order.customer) {
    if (typeof order.customer === "string") {
      customerName = order.customer;
    } else if (typeof order.customer === "object") {
      customerName = order.customer.name || order.customer.customerName || customerName;
      customerPhone = order.customer.phone || order.customer.customerPhone || customerPhone;
    }
  }

  if (!customerName || customerName === "Customer") {
    customerName = order.customerDetails?.name || order.customerName || customerName;
  }

  if (!customerPhone) {
    customerPhone = order.customerPhone || order.customerDetails?.phone || customerPhone;
  }

  const tableNumber =
    order.tableNo ||
    order.table?.tableNo ||
    order.table?.no ||
    order.tableNumber ||
    order.table_number ||
    "N/A";

  const orderId = order._id || order.id || "N/A";

  const status =
    order.status ||
    order.orderStatus ||
    order.paymentStatus ||
    "Pending";

  const total =
    order.total ||
    order.bills?.totalWithTax ||
    order.grandTotal ||
    0;

  // Try many common shapes for order items
  const rawItemsCandidate =
    order.items ||
    order.orderItems ||
    order.order_items ||
    order.cart ||
    order.products ||
    order.itemsList ||
    [];

  // If the candidate is a number (some APIs store count in `items`), treat as empty array
  const rawItems = typeof rawItemsCandidate === "number" ? [] : rawItemsCandidate;

  // If it's an object map { id: item, ... }, convert to array
  const itemsArray = !Array.isArray(rawItems) && rawItems && typeof rawItems === "object"
    ? Object.values(rawItems)
    : rawItems;

  const items = Array.isArray(itemsArray) ? itemsArray : [];
  const itemsCount = items.length;

  // Attempt to resolve item name/price when the order item is only an id/reference
  const menusFromState = useSelector((state) => state.menu);

  const findMenuItem = (itemId) => {
    const menusToSearch = Array.isArray(menusFromState) && menusFromState.length > 0 ? menusFromState : seedMenus;
    for (const cat of menusToSearch) {
      if (!cat || !Array.isArray(cat.items)) continue;
      const found = cat.items.find((it) => String(it.id) === String(itemId) || it._id === itemId || it.id === itemId);
      if (found) return found;
    }
    return null;
  };

  const resolveItem = (it) => {
    // If it already has name & price, return as-is
    const name = (it && (it.name || it.itemName || it.productName || it.title)) || null;
    const price = (it && (it.price || it.unitPrice || it.amount || it.cost)) || null;
    if (name && (price !== undefined)) return { name, price };

    // If it's just an id/reference
    const possibleId = it.id || it.itemId || it.menuId || it;
    const found = findMenuItem(possibleId);
    if (found) return { name: found.name, price: found.price || found.unitPrice || 0 };

    // Fallback
    return { name: name || "Item", price: Number(price) || 0 };
  };

  // If order total is missing (0), compute from resolved items
  let computedTotal = 0;
  try {
    computedTotal = items.reduce((sum, it) => {
      const qty = it.qty || it.quantity || it.count || 1;
      const resolved = resolveItem(it);
      const price = Number(resolved.price) || 0;
      return sum + price * qty;
    }, 0);
  } catch (e) {
    // ignore
  }

  const displayedTotal = (total && Number(total) > 0) ? Number(total) : computedTotal;

  const orderDate = order.createdAt || order.dateTime || order.timestamp;

  // Debugging: if key fields are missing, print the order so we can inspect incoming shape
  // eslint-disable-next-line no-console
  if (customerName === "Customer" || tableNumber === "N/A" || itemsCount === 0 || displayedTotal === 0) {
    // eslint-disable-next-line no-console
    console.debug("OrderCardNew - suspicious order shape:", { orderId, customerName, customerPhone, tableNumber, itemsCount, displayedTotal, order });
  }

  // ──────────────────────────────────────────────────────────────
  // 2. WhatsApp Message Builder
  // ──────────────────────────────────────────────────────────────
  const sendToWhatsApp = () => {
    if (itemsCount === 0) {
      alert("No items in this order!");
      return;
    }

    const businessPhone = "254742462975"; // WhatsApp number (normalized)

    // Build a readable plain-text message then encode for URL
    let lines = [];
    lines.push(`Order #${orderId}`);
    lines.push(`Customer: ${customerName}` + (customerPhone ? ` ( ${customerPhone} )` : ""));
    lines.push(`Table: ${tableNumber}`);
    lines.push("-----------------------");

    items.forEach((item, i) => {
      const name = item.name || item.itemName || "Item";
      const qty = item.qty || item.quantity || 1;
      const price = Number(item.price) || Number(item.unitPrice) || 0;
      const lineTotal = (price * qty).toFixed(2);
      lines.push(`${i + 1}. ${name}`);
      lines.push(`   Qty: ${qty}  Unit: KSH ${price}  Line: KSH ${lineTotal}`);
      if (item.description) lines.push(`   Note: ${item.description}`);
    });

    lines.push("-----------------------");
    lines.push(`Total: KSH ${total.toFixed(2)}`);
    lines.push(`Status: ${status}`);
    if (orderDate) lines.push(`Time: ${new Date(orderDate).toLocaleString()}`);

    const plain = lines.join("\n");
    const waURL = `https://wa.me/${businessPhone}?text=${encodeURIComponent(plain)}`;
    window.open(waURL, "_blank");
  };

  // ──────────────────────────────────────────────────────────────
  // 3. Status Badge Styling
  // ──────────────────────────────────────────────────────────────
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "completed") return "status-completed";
    if (s === "ready") return "status-ready";
    if (s === "in progress") return "status-progress";
    if (s === "cancelled") return "status-cancelled";
    return "status-pending";
  };

  // ──────────────────────────────────────────────────────────────
  // 4. Render
  // ──────────────────────────────────────────────────────────────
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoadToCart = () => {
    if (!items || items.length === 0) {
      enqueueSnackbar("This order has no items to load into the cart", { variant: "warning" });
      return;
    }

    // Normalize items into cart format { id, name, price, quantity }
    const normalized = items.map((it, idx) => {
      const qty = it.qty || it.quantity || it.count || 1;
      const resolved = resolveItem(it);
      const id = it.id || it.itemId || it.menuId || it._id || `${orderId}-${idx}`;
      return {
        id: String(id),
        name: resolved.name || `Item ${idx + 1}`,
        price: Number(resolved.price) || 0,
        quantity: qty,
      };
    });

    // Set the cart to the order items (replace existing cart)
    dispatch(setCart(normalized));
    // Add this order to quick history so user can reference it later
    dispatch(addOrderToHistory({ id: orderId, customerName, customerPhone, tableNumber, items: normalized, total: displayedTotal }));

    enqueueSnackbar("Order loaded into cart", { variant: "success" });

    // Navigate to menu/POS where cart is visible for printing receipts
    try {
      navigate("/menu");
    } catch (e) {
      // swallow navigation errors in contexts where router isn't present
      // (e.g., storybook/tests). The cart is still set in Redux.
    }
  };
  
  return (
    <div className="order-card">
      {/* Header */}
      <div className="order-header">
        <div className="order-info">
          <h3 className="order-id">
            Order #{orderId}
          </h3>
          <div className="customer-info">
            <p className="customer-name">{customerName}</p>
            {customerPhone && (
              <p className="customer-phone">📱 {customerPhone}</p>
            )}
            {order.customerDetails?.guests || order.guests ? (
              <p className="customer-guests">👥 {order.customerDetails?.guests || order.guests} guests</p>
            ) : null}
          </div>
        </div>
        <span className={`status-badge ${getStatusStyle(status)}`}>
          {status}
        </span>
      </div>

      {/* Details */}
      <div className="order-details">
        <div className="detail-item">
          <span className="detail-label">Table:</span>
          <span className="detail-value">{tableNumber}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Items:</span>
          <span className="detail-value">{itemsCount}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Total:</span>
          <span className="detail-total">
            KSH {displayedTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Items list (collapsible) */}
      <div className="items-section">
        <button
          onClick={() => setOpen((v) => !v)}
          className="toggle-items-btn"
        >
          <span>{open ? "▲ Hide" : "▼ Show"} items</span>
          <span className="item-count">({itemsCount})</span>
        </button>
        {open && (
          <div className="items-list">
            {items.map((it, idx) => {
              const qty = it.qty || it.quantity || 1;
              const resolved = resolveItem(it);
              const name = resolved.name;
              const price = Number(resolved.price) || 0;
              return (
                <div key={it.id || idx} className="item-row">
                  <div className="item-info">
                    <span className="item-name">{name}</span>
                    <span className="item-quantity">× {qty}</span>
                  </div>
                  <div className="item-price">KSH {(price * qty).toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Date */}
      <div className="order-footer">
        <p className="order-date">
          {orderDate
            ? new Date(orderDate).toLocaleString()
            : "Date N/A"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="order-actions">
        {(isWebsite || order?.source === 'website' || order?.source === 'website-order' || order?.isWebsite || order?.is_website) ? (
          <button onClick={handleLoadToCart} className="btn btn-primary load-cart-btn">
            Load to Cart
          </button>
        ) : null}
      </div>

      {/* WhatsApp Button */}
      <button
        onClick={sendToWhatsApp}
        className="whatsapp-btn"
      >
        <svg
          className="whatsapp-icon"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
        Send to WhatsApp
      </button>

      <style jsx>{`
        .order-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .order-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .order-info {
          flex: 1;
        }

        .order-id {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .customer-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .customer-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin: 0;
        }

        .customer-phone,
        .customer-guests {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .status-badge {
          padding: 0.4rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          margin-left: 0.75rem;
        }

        .status-completed {
          background: rgba(40, 167, 69, 0.1);
          color: var(--success);
          border: 1px solid rgba(40, 167, 69, 0.2);
        }

        .status-ready {
          background: rgba(212, 165, 116, 0.1);
          color: var(--secondary);
          border: 1px solid rgba(212, 165, 116, 0.2);
        }

        .status-progress {
          background: rgba(255, 193, 7, 0.1);
          color: var(--warning);
          border: 1px solid rgba(255, 193, 7, 0.2);
        }

        .status-cancelled {
          background: rgba(220, 53, 69, 0.1);
          color: var(--danger);
          border: 1px solid rgba(220, 53, 69, 0.2);
        }

        .status-pending {
          background: rgba(108, 117, 125, 0.1);
          color: var(--text-secondary);
          border: 1px solid rgba(108, 117, 125, 0.2);
        }

        .order-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: var(--bg-body);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .detail-value {
          font-size: 0.875rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        .detail-total {
          font-size: 1rem;
          color: var(--success);
          font-weight: 700;
        }

        .items-section {
          margin-bottom: 1rem;
        }

        .toggle-items-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.5rem 0;
          transition: color 0.2s ease;
          width: 100%;
        }

        .toggle-items-btn:hover {
          color: var(--primary-hover);
        }

        .item-count {
          background: var(--primary-light);
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .items-list {
          margin-top: 0.75rem;
          padding: 1rem;
          background: var(--bg-body);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }

        .item-name {
          font-size: 0.875rem;
          color: var(--text-primary);
          font-weight: 500;
          flex: 1;
        }

        .item-quantity {
          font-size: 0.8rem;
          color: var(--text-muted);
          background: var(--border-color);
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          font-weight: 600;
        }

        .item-price {
          font-size: 0.875rem;
          color: var(--success);
          font-weight: 600;
          white-space: nowrap;
        }

        .order-footer {
          margin-bottom: 1rem;
        }

        .order-date {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-align: center;
          margin: 0;
          font-style: italic;
        }

        .order-actions {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .load-cart-btn {
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .load-cart-btn:hover {
          transform: translateY(-1px);
        }

        .whatsapp-btn {
          width: 100%;
          padding: 0.875rem 1rem;
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
        }

        .whatsapp-btn:hover {
          background: linear-gradient(135deg, #128C7E, #075E54);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
        }

        .whatsapp-btn:active {
          transform: translateY(0);
        }

        .whatsapp-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .order-card {
            padding: 1.25rem;
          }

          .order-header {
            flex-direction: column;
            gap: 0.75rem;
          }

          .status-badge {
            align-self: flex-start;
            margin-left: 0;
          }

          .order-details {
            padding: 0.75rem;
          }

          .items-list {
            padding: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .order-card {
            padding: 1rem;
            border-radius: 8px;
          }

          .order-id {
            font-size: 1.125rem;
          }

          .whatsapp-btn {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderCardNew;