import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeFromCart, clearCart } from "../../redux/slices/cartSlice";
import { addOrder as addOrderRedux } from "../../redux/slices/orderSlice";
import { addOrder as addOrderApi } from "../../https/Index.js";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaWhatsapp, FaPrint, FaShoppingCart } from "react-icons/fa";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const items = useSelector((state) => state.cart?.items ?? []);
  const customer = useSelector((state) => state.customer || {});
  const navigate = useNavigate();

  const total = useMemo(() => items.reduce((s, it) => s + (Number(it.price) || 0) * (it.quantity || 1), 0), [items]);

  const handleIncrease = (id) => dispatch(updateQuantity({ id, quantity: (items.find(i => i.id === id)?.quantity || 0) + 1 }));
  const handleDecrease = (id) => {
    const cur = items.find(i => i.id === id)?.quantity || 0;
    if (cur <= 1) return dispatch(removeFromCart(id));
    dispatch(updateQuantity({ id, quantity: cur - 1 }));
  };

  const placeOrderLocal = (payload) => {
    dispatch(addOrderRedux(payload));
    dispatch(clearCart());
    enqueueSnackbar("Order placed locally", { variant: "success" });
    navigate("/orders");
  };

  const checkout = async () => {
    if (!items.length) {
      enqueueSnackbar("Cart is empty", { variant: "warning" });
      return;
    }

    const payload = {
      items: items.map(({ id, name, price, quantity, description }) => ({ id, name, price, quantity, description })),
      total,
      customer: {
        name: customer.customerName || "Walk-in",
        phone: customer.customerPhone || "",
        guests: customer.guests || 0,
      },
      table: customer.table || null,
      tableNo: customer.table?.tableNo || "N/A",
      createdAt: new Date().toISOString(),
      orderStatus: "Pending",
    };

    try {
      const res = await addOrderApi(payload);
      // Normalize API response shape before storing in Redux
      const normalizeSaved = (r, fallback) => {
        if (!r) return fallback;
        // Typical shapes: { ...order } or { data: order } or { data: { data: [order] } }
        const d = r?.data ?? r;
        if (!d) return fallback;
        // If d is an object with nested .data, unwrap it
        if (d && d.data !== undefined) {
          // If it's an array and has one item, return item, otherwise return array or object
          if (Array.isArray(d.data)) return d.data.length === 1 ? d.data[0] : d.data;
          return d.data;
        }
        return d;
      };

      const saved = normalizeSaved(res, payload);
      console.debug("CartSidebar - checkout saved to dispatch:", saved);
      // Ensure we dispatch a plain object (not a response wrapper)
      if (Array.isArray(saved)) {
        // If server returned an array, try to pick the first (single order created)
        dispatch(addOrderRedux(saved[0] || payload));
      } else {
        dispatch(addOrderRedux(saved));
      }
      dispatch(clearCart());
      enqueueSnackbar("Order checked out and saved to server", { variant: "success" });
      navigate("/orders");
    } catch (err) {
      console.error("Checkout API error", err);
      enqueueSnackbar("Failed to checkout to server — saved locally instead", { variant: "warning" });
      placeOrderLocal(payload);
      navigate("/orders");
    }
  };

  const printReceipt = () => {
    if (!items.length) {
      enqueueSnackbar("Cart is empty", { variant: "warning" });
      return;
    }

    const TAX_RATE = 0.16; // 16% VAT
    const subtotal = total;
    const tax = (subtotal * TAX_RATE).toFixed(2);
    const grandTotal = (subtotal + Number(tax)).toFixed(2);

    const receiptHtml = `
      <html>
        <head>
          <title>Receipt - Sharubati</title>
          <style>
            @media print {
              body { margin: 0; padding: 10px; }
              button { display: none; }
            }
            body {
              font-family: 'Courier New', Arial, sans-serif;
              padding: 20px;
              max-width: 300px;
              margin: 0 auto;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .restaurant-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .receipt-date {
              font-size: 12px;
              color: #64748b;
            }
            .items {
              margin: 15px 0;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 12px;
            }
            .item-name {
              flex: 1;
            }
            .item-price {
              text-align: right;
              min-width: 80px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .summary {
              margin-top: 15px;
              font-size: 12px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .summary-row.total {
              font-weight: bold;
              font-size: 14px;
              border-top: 2px solid #000;
              padding-top: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 11px;
              color: #64748b;
            }
            .customer-info {
              font-size: 11px;
              margin-top: 10px;
              padding: 5px;
              background: #f1f5f9;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="restaurant-name">SHARUBATI</div>
            <div class="receipt-date">${new Date().toLocaleString()}</div>
          </div>

          <div class="divider"></div>

          <div class="items">
            ${items
              .map(
                (it) =>
                  `<div class="item-row">
                    <div class="item-name">${it.name}</div>
                    <div>x${it.quantity || 1}</div>
                  </div>
                  <div class="item-row" style="padding-left: 20px;">
                    <div style="font-size: 10px; color: #64748b;">KSH ${it.price || 0} × ${it.quantity || 1}</div>
                    <div class="item-price">KSH ${((Number(it.price) || 0) * (it.quantity || 1)).toFixed(2)}</div>
                  </div>`
              )
              .join("")}
          </div>

          <div class="divider"></div>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>KSH ${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Tax (16% VAT)</span>
              <span>KSH ${tax}</span>
            </div>
            <div class="summary-row total">
              <span>TOTAL</span>
              <span>KSH ${grandTotal}</span>
            </div>
          </div>

          ${
            customer.customerName || customer.customerPhone || customer.guests
              ? `<div class="customer-info">
                  ${customer.customerName ? `<div><strong>Customer:</strong> ${customer.customerName}</div>` : ""}
                  ${customer.customerPhone ? `<div><strong>Phone:</strong> ${customer.customerPhone}</div>` : ""}
                  ${customer.guests ? `<div><strong>Guests:</strong> ${customer.guests}</div>` : ""}
                  ${customer.table?.tableNo ? `<div><strong>Table:</strong> ${customer.table.tableNo}</div>` : ""}
                </div>`
              : ""
          }

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>www.sharubati.com</p>
          </div>
        </body>
      </html>
    `;

    const w = window.open("", "RECEIPT", "width=400,height=600");
    if (w) {
      w.document.write(receiptHtml);
      w.document.close();
      w.focus();
      setTimeout(() => {
        w.print();
      }, 250);
    }
    enqueueSnackbar("Receipt opened for printing/PDF export", { variant: "success" });
  };

  const sendReceiptWhatsApp = () => {
    if (!items.length) {
      enqueueSnackbar("Cart is empty", { variant: "warning" });
      return;
    }

    const TAX_RATE = 0.16;
    const subtotal = total;
    const tax = (subtotal * TAX_RATE).toFixed(2);
    const grandTotal = (subtotal + Number(tax)).toFixed(2);

    const businessPhone = "254742462975";

    const lines = [];
    lines.push("🧾 *SHARUBATI RECEIPT*");
    lines.push(`📅 ${new Date().toLocaleString()}`);
    lines.push("━".repeat(40));

    items.forEach((it, idx) => {
      const qty = it.quantity || 1;
      const price = Number(it.price) || 0;
      const lineTotal = (price * qty).toFixed(2);
      lines.push(`${idx + 1}. *${it.name}*`);
      lines.push(`   Qty: ${qty} | Unit: KSH ${price} | Total: KSH ${lineTotal}`);
    });

    lines.push("━".repeat(40));
    lines.push(`Subtotal: KSH ${subtotal.toFixed(2)}`);
    lines.push(`Tax (16% VAT): KSH ${tax}`);
    lines.push(`💰 *TOTAL: KSH ${grandTotal}*`);
    
    if (customer.customerName) lines.push(`\n👤 Customer: ${customer.customerName}`);
    if (customer.customerPhone) lines.push(`📱 Phone: ${customer.customerPhone}`);
    if (customer.guests) lines.push(`👥 Guests: ${customer.guests}`);
    if (customer.table?.tableNo) lines.push(`🪑 Table: ${customer.table.tableNo}`);

    lines.push("\n_Thank you for your business!_");
    lines.push("www.sharubati.com");

    const message = lines.join("\n");
    const waURL = `https://wa.me/${businessPhone}?text=${encodeURIComponent(message)}`;
    window.open(waURL, "_blank");
  };

  return (
    <div className="cart-sidebar">
      <div className="cart-card">
        <div className="cart-header">
          <FaShoppingCart className="cart-icon" />
          <h3 className="cart-title">Order Cart</h3>
          {items.length > 0 && (
            <div className="cart-badge">{items.length}</div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <p className="empty-text">Your cart is empty</p>
            <p className="empty-subtext">Add items from the menu to get started</p>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items">
              {items.map((it) => (
                <div key={it.id} className="cart-item">
                  <div className="item-header">
                    <div className="item-name">{it.name}</div>
                    <div className="item-price">KSH {it.price}</div>
                  </div>
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleDecrease(it.id)} 
                        className="quantity-btn decrease"
                      >
                        <FaMinus size={10} />
                      </button>
                      <div className="quantity-display">{it.quantity || 1}</div>
                      <button 
                        onClick={() => handleIncrease(it.id)} 
                        className="quantity-btn increase"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                    <button 
                      onClick={() => dispatch(removeFromCart(it.id))} 
                      className="remove-btn"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">KSH {total.toFixed(2)}</span>
              </div>
              
              {/* Action Buttons */}
              <div className="action-buttons">
                <button onClick={checkout} className="action-btn primary-btn">
                  Checkout & Save
                </button>
                
                <button onClick={printReceipt} className="action-btn secondary-btn">
                  <FaPrint className="btn-icon" />
                  Print Receipt
                </button>
                
                <button onClick={sendReceiptWhatsApp} className="action-btn whatsapp-btn">
                  <FaWhatsapp className="btn-icon" />
                  Send via WhatsApp
                </button>
                
                <button 
                  onClick={() => placeOrderLocal({
                    items: items.map(({ id, name, price, quantity, description }) => ({ id, name, price, quantity, description })),
                    total,
                    customer: { name: customer.customerName || "Walk-in", phone: customer.customerPhone || "", guests: customer.guests || 0 },
                    table: customer.table || null,
                    tableNo: customer.table?.tableNo || "N/A",
                    createdAt: new Date().toISOString(),
                    orderStatus: "Pending",
                  })} 
                  className="action-btn outline-btn"
                >
                  Save Locally Only
                </button>
                
                <button 
                  onClick={() => dispatch(clearCart())} 
                  className="action-btn danger-btn"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-sidebar {
          width: 100%;
          font-family: 'Inter', sans-serif;
        }

        .cart-card {
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
          overflow: hidden;
          height: fit-content;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
        }

        .cart-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .cart-icon {
          color: var(--primary);
          font-size: 1.25rem;
        }

        .cart-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          flex: 1;
        }

        .cart-badge {
          background: var(--primary);
          color: white;
          border-radius: 20px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          min-width: 1.5rem;
          text-align: center;
        }

        .empty-cart {
          padding: 3rem 2rem;
          text-align: center;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-text {
          color: var(--text-primary);
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
        }

        .empty-subtext {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.875rem;
        }

        .cart-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.5rem;
        }

        .cart-item {
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .item-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.95rem;
          flex: 1;
          margin-right: 1rem;
          line-height: 1.4;
        }

        .item-price {
          color: var(--primary);
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
        }

        .item-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quantity-btn {
          width: 2rem;
          height: 2rem;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          background: var(--input-bg);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quantity-btn:hover {
          border-color: var(--primary);
          background: var(--primary);
          color: white;
        }

        .quantity-display {
          min-width: 2rem;
          text-align: center;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .remove-btn {
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-btn:hover {
          color: var(--danger);
          background: var(--danger-light);
        }

        .cart-summary {
          padding: 1.5rem;
          border-top: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .summary-label {
          color: var(--text-primary);
          font-weight: 600;
          font-size: 1rem;
        }

        .summary-value {
          color: var(--primary);
          font-weight: 700;
          font-size: 1.25rem;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .primary-btn {
          background: var(--primary);
          color: white;
          box-shadow: 0 2px 8px rgba(13, 110, 253, 0.2);
        }

        .primary-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
        }

        .secondary-btn {
          background: var(--card-bg);
          color: var(--text-primary);
          border: 1.5px solid var(--border-color);
        }

        .secondary-btn:hover {
          border-color: var(--primary);
          background: var(--bg-hover);
        }

        .whatsapp-btn {
          background: #25D366;
          color: white;
          box-shadow: 0 2px 8px rgba(37, 211, 102, 0.2);
        }

        .whatsapp-btn:hover {
          background: #128C7E;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        }

        .outline-btn {
          background: transparent;
          color: var(--text-primary);
          border: 1.5px solid var(--border-color);
        }

        .outline-btn:hover {
          border-color: var(--primary);
          background: var(--bg-hover);
        }

        .danger-btn {
          background: var(--danger-light);
          color: var(--danger);
          border: 1.5px solid var(--danger-border);
        }

        .danger-btn:hover {
          background: var(--danger);
          color: white;
        }

        .btn-icon {
          font-size: 0.875rem;
        }

        /* Custom scrollbar */
        .cart-items::-webkit-scrollbar {
          width: 4px;
        }

        .cart-items::-webkit-scrollbar-track {
          background: var(--bg-secondary);
          border-radius: 2px;
        }

        .cart-items::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 2px;
        }

        .cart-items::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .cart-sidebar {
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 768px) {
          .cart-card {
            border-radius: 12px;
            max-height: none;
          }

          .cart-header {
            padding: 1rem 1.25rem;
          }

          .cart-items {
            padding: 0.75rem 1.25rem;
            max-height: 250px;
          }

          .cart-summary {
            padding: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .cart-header {
            padding: 1rem;
          }

          .cart-title {
            font-size: 1.125rem;
          }

          .cart-items {
            padding: 0.5rem 1rem;
          }

          .cart-summary {
            padding: 1rem;
          }

          .action-btn {
            padding: 0.75rem 0.875rem;
            font-size: 0.9rem;
          }
        }

        /* Focus states for accessibility */
        .action-btn:focus,
        .quantity-btn:focus,
        .remove-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        /* Animation for cart items */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .cart-item {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CartSidebar;