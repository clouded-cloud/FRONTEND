import React from "react";

const OrderListNew = ({ order }) => {
  // ──────────────────────────────────────────────────────────────
  // 1. Normalise all possible data shapes
  // ──────────────────────────────────────────────────────────────
  const customerName =
    order.customer ||
    order.customerDetails?.name ||
    order.customerName ||
    order.customer?.name ||
    "Customer";

  const customerPhone =
    order.customerPhone ||
    order.customerDetails?.phone ||
    order.customer?.phone ||
    "";

  const tableNumber =
    order.tableNo ||
    order.table?.tableNo ||
    order.tableNumber ||
    "Takeaway";

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

  // Items – support multiple shapes
  const items = Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.orderItems)
    ? order.orderItems
    : Array.isArray(order.cartItems)
    ? order.cartItems
    : [];

  // ──────────────────────────────────────────────────────────────
  // 2. Build WhatsApp message (URL-encoded)
  // ──────────────────────────────────────────────────────────────
  const sendToWhatsApp = () => {
    if (!items.length) {
      alert("No items in order!");
      return;
    }

    const businessPhone = "254742462975"; // ← CHANGE TO YOUR WHATSAPP BUSINESS NUMBER

    let message = `*New Order*%0A%0A`;
    message += `*Customer:* ${customerName}%0A`;
    if (customerPhone) message += `*Phone:* ${customerPhone}%0A`;
    message += `*Table:* ${tableNumber}%0A%0A`;

    items.forEach((it, i) => {
      const name = it.name || it.itemName || "Item";
      const qty = it.qty || it.quantity || 1;
      const price = it.price || it.unitPrice || 0;
      const lineTotal = (price * qty).toFixed(2);
      message += `${i + 1}. ${name} × ${qty} = KSH${lineTotal}%0A`;
    });

    message += `%0A*Total:* KSH${total.toFixed(2)}%0A`;
    message += `*Status:* ${status}`;

    const waURL = `https://wa.me/${businessPhone}?text=${message}`;
    window.open(waURL, "_blank");
  };

  // Status color mapping
  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('ready') || statusLower.includes('complete')) {
      return 'status-ready';
    } else if (statusLower.includes('progress')) {
      return 'status-progress';
    } else {
      return 'status-pending';
    }
  };

  // ──────────────────────────────────────────────────────────────
  // 3. Render
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="order-card">
      {/* Header: Name + Table */}
      <div className="order-header">
        <div className="customer-info">
          <div className="customer-avatar">
            {customerName.charAt(0).toUpperCase()}
          </div>
          <div className="customer-details">
            <p className="customer-name">{customerName}</p>
            <p className="table-info">Table {tableNumber}</p>
          </div>
        </div>

        <div className="order-summary">
          <p className="order-total">KSH {total.toFixed(2)}</p>
          <p className={`order-status ${getStatusColor(status)}`}>
            {status}
          </p>
        </div>
      </div>

      {/* Items List */}
      {items.length > 0 && (
        <div className="order-items">
          {items.map((it, i) => {
            const name = it.name || it.itemName || "Item";
            const qty = it.qty || it.quantity || 1;
            const price = it.price || it.unitPrice || 0;
            const lineTotal = (price * qty).toFixed(2);
            
            return (
              <div key={i} className="order-item">
                <span className="item-name">
                  {name} × {qty}
                </span>
                <span className="item-price">KSH {lineTotal}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={sendToWhatsApp}
        className="whatsapp-button"
      >
        <svg className="whatsapp-icon" viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.464"/>
        </svg>
        Send to WhatsApp
      </button>

      <style jsx>{`
        .order-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          border: 1px solid #e9ecef;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .order-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #2c5530;
        }

        .order-card:hover {
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
          border-color: #4a7c59;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .customer-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .customer-avatar {
          width: 3rem;
          height: 3rem;
          background: linear-gradient(135deg, #2c5530, #4a7c59);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.125rem;
          flex-shrink: 0;
          box-shadow: 0 4px 8px rgba(44, 85, 48, 0.2);
        }

        .customer-details {
          display: flex;
          flex-direction: column;
        }

        .customer-name {
          font-weight: 600;
          color: #343a40;
          margin: 0;
          font-size: 1.125rem;
        }

        .table-info {
          color: #6c757d;
          margin: 0.25rem 0 0 0;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .order-summary {
          text-align: right;
        }

        .order-total {
          font-weight: 700;
          color: #343a40;
          margin: 0;
          font-size: 1.25rem;
        }

        .order-status {
          margin: 0.5rem 0 0 0;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-ready {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
          border: 1px solid rgba(40, 167, 69, 0.2);
        }

        .status-progress {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.2);
        }

        .status-pending {
          background: rgba(44, 85, 48, 0.1);
          color: #2c5530;
          border: 1px solid rgba(44, 85, 48, 0.2);
        }

        .order-items {
          margin: 1.25rem 0 1.5rem 3.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e9ecef;
          transition: all 0.2s ease;
        }

        .order-item:hover {
          background: #f8f9fa;
          margin: 0 -0.5rem;
          padding: 0.75rem 0.5rem;
          border-radius: 8px;
          border-bottom-color: transparent;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-name {
          color: #343a40;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .item-price {
          color: #2c5530;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .whatsapp-button {
          width: 100%;
          padding: 1rem 1.5rem;
          background: #25D366;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(37, 211, 102, 0.3);
        }

        .whatsapp-button:hover {
          background: #128C7E;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 211, 102, 0.4);
        }

        .whatsapp-button:active {
          transform: translateY(0);
        }

        .whatsapp-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .whatsapp-button:hover::before {
          left: 100%;
        }

        .whatsapp-icon {
          flex-shrink: 0;
        }

        /* Animation for order items */
        .order-item {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Stagger animation for order items */
        .order-item:nth-child(1) { animation-delay: 0.1s; }
        .order-item:nth-child(2) { animation-delay: 0.2s; }
        .order-item:nth-child(3) { animation-delay: 0.3s; }
        .order-item:nth-child(4) { animation-delay: 0.4s; }

        /* Responsive Design */
        @media (max-width: 768px) {
          .order-card {
            padding: 1.25rem;
            margin-bottom: 0.75rem;
            border-radius: 8px;
          }

          .order-header {
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
          }

          .order-summary {
            text-align: left;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .order-items {
            margin-left: 0;
            margin-top: 1rem;
          }

          .customer-avatar {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1rem;
          }

          .customer-name {
            font-size: 1rem;
          }

          .order-total {
            font-size: 1.125rem;
          }
        }

        @media (max-width: 480px) {
          .order-card {
            padding: 1rem;
            border-radius: 8px;
          }

          .customer-avatar {
            width: 2.25rem;
            height: 2.25rem;
            font-size: 0.875rem;
          }

          .customer-name {
            font-size: 0.95rem;
          }

          .order-total {
            font-size: 1rem;
          }

          .whatsapp-button {
            padding: 0.875rem 1.25rem;
            font-size: 0.8rem;
          }

          .order-items {
            margin: 1rem 0 1.25rem 0;
          }
        }

        /* Print styles */
        @media print {
          .order-card {
            border: 1px solid #ccc;
            box-shadow: none;
            page-break-inside: avoid;
          }
          
          .whatsapp-button {
            display: none;
          }
        }

        /* Focus states for accessibility */
        .whatsapp-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.25);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .order-card,
          .order-item,
          .whatsapp-button {
            transition: none;
            animation: none;
          }

          .order-card:hover {
            transform: none;
          }

          .whatsapp-button:hover {
            transform: none;
          }

          .whatsapp-button::before {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderListNew;