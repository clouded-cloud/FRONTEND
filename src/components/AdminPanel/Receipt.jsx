// src/components/common/Receipt.jsx
import React, { useRef, useEffect, useCallback } from 'react';
import './Receipt.css'; // We'll create this next

const Receipt = ({ order, onClose }) => {
  const modalRef = useRef();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose; // always points to the latest prop

  /* ---------- 1.  Guard-clause (same as before)  ---------- */
  if (!order) {
    return (
      <div className="receipt-overlay">
        <div className="receipt-modal" ref={modalRef}>
          <div className="receipt-content">
            <div className="receipt-header">
              <h2>Order Receipt</h2>
              <button className="close-btn" onClick={() => onCloseRef.current?.()}>
                ×
              </button>
            </div>
            <div className="receipt-error">
              <h3>Error: No Order Data</h3>
              <p>The receipt cannot be displayed because no order information was provided.</p>
            </div>
            <div className="receipt-actions">
              <button onClick={() => onCloseRef.current?.()} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- 2.  Safe data extraction  ---------- */
  const orderId        = order.id ?? 'N/A';
  const tableNumber    = order.table_number ?? 'N/A';
  const orderDate      = order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A';
  const waiterName     = order.waiter_name ?? 'System';
  const orderTotal     = parseFloat(order.total || 0);
  const orderItems     = Array.isArray(order.items) ? order.items : [];
  const hasItems       = orderItems.length > 0;

  const taxRate      = 0.085;
  const taxAmount    = orderTotal * taxRate;
  const finalTotal   = orderTotal + taxAmount;

  /* ---------- 3.  Keyboard / outside-click listeners (run once)  ---------- */
  useEffect(() => {
    const handleEscape = e => e.key === 'Escape' && onCloseRef.current?.();
    const handleClick  = e => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onCloseRef.current?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClick);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClick);
      document.body.style.overflow = '';
    };
  }, []);

  /* ---------- 4.  Handlers  ---------- */
  const handleClose = useCallback(() => onCloseRef.current?.(), []);
  const handlePrint = useCallback(() => window.print(), []);

  /* ---------- 5.  Focus management (accessibility)  ---------- */
  useEffect(() => {
    modalRef.current?.querySelector('.close-btn')?.focus();
  }, []);

  /* ---------- 6.  Render  ---------- */
  return (
    <div className="receipt-overlay" role="dialog" aria-modal="true">
      <div className="receipt-modal" ref={modalRef}>
        <div className="receipt-content">
          <div className="receipt-header">
            <h2>Order Receipt #{orderId}</h2>
            <button className="close-btn" onClick={handleClose} aria-label="Close receipt">
              ×
            </button>
          </div>

          <div className="receipt-body">
            <div className="receipt-info">
              <p><strong>Order ID:</strong> #{orderId}</p>
              <p><strong>Table:</strong> {tableNumber}</p>
              <p><strong>Date:</strong> {orderDate}</p>
              <p><strong>Server:</strong> {waiterName}</p>
            </div>

            <div className="receipt-items">
              <h4>Order Items</h4>
              {hasItems ? (
                <div className="items-table">
                  <div className="table-header">
                    <span>Item</span><span>Qty</span><span>Price</span><span>Total</span>
                  </div>
                  {orderItems.map((item, idx) => {
                    const name  = item.name ?? 'Unknown Item';
                    const qty   = item.quantity ?? 0;
                    const price = parseFloat(item.price || 0);
                    const total = qty * price;
                    return (
                      <div key={idx} className="table-row">
                        <span>{name}</span>
                        <span>{qty}</span>
                        <span>${price.toFixed(2)}</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="no-items">No items in this order</p>
              )}
            </div>

            <div className="receipt-totals">
              <div className="total-row"><span>Subtotal:</span><span>${orderTotal.toFixed(2)}</span></div>
              <div className="total-row"><span>Tax (8.5%):</span><span>${taxAmount.toFixed(2)}</span></div>
              <div className="total-row grand-total">
                <span><strong>Total:</strong></span>
                <span><strong>${finalTotal.toFixed(2)}</strong></span>
              </div>
            </div>
          </div>

          <div className="receipt-actions">
            <button
              onClick={handlePrint}
              disabled={!hasItems}
              className="btn btn-primary"
            >
              Print Receipt
            </button>
            <button onClick={handleClose} className="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;