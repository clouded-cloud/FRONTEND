import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaPrint, FaTimes } from "react-icons/fa";

const Invoice = ({ orderInfo, setShowInvoice }) => {
  const invoiceRef = useRef(null);
  
  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");

    WinPrint.document.write(`
      <html>
        <head>
          <title>Order Receipt - SHARUBATI</title>
          <style>
            body { 
              font-family: 'Inter', Arial, sans-serif; 
              padding: 20px; 
              background: #f8f9fa;
              color: #343a40;
            }
            .receipt-container { 
              max-width: 400px; 
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              padding: 2rem;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              border: 1px solid #e9ecef;
            }
            .success-icon {
              display: flex;
              justify-content: center;
              margin-bottom: 1.5rem;
            }
            .icon-circle {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background: #2c5530;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
            }
            h2 { 
              text-align: center; 
              color: #2c5530;
              font-size: 1.5rem;
              font-weight: 700;
              margin-bottom: 0.5rem;
            }
            .subtitle {
              text-align: center;
              color: #6c757d;
              margin-bottom: 2rem;
            }
            .section {
              margin-bottom: 1.5rem;
              padding-bottom: 1rem;
              border-bottom: 1px solid #e9ecef;
            }
            .section-title {
              color: #2c5530;
              font-weight: 600;
              margin-bottom: 0.75rem;
              font-size: 1rem;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 0.5rem;
              font-size: 0.9rem;
            }
            .total-section {
              background: #f8f9fa;
              padding: 1rem;
              border-radius: 8px;
              margin: 1.5rem 0;
            }
            .grand-total {
              font-size: 1.1rem;
              font-weight: 700;
              color: #2c5530;
            }
            .payment-info {
              background: #f0fdf4;
              padding: 1rem;
              border-radius: 8px;
              border: 1px solid #bbf7d0;
            }
            @media print {
              body { background: white; padding: 0; }
              .receipt-container { box-shadow: none; border: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${printContent}
          </div>
        </body>
      </html>
    `);

    WinPrint.document.close();
    WinPrint.focus();
    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 1000);
  };

  return (
    <div className="invoice-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="invoice-container"
      >
        {/* Receipt Content for Printing */}
        <div ref={invoiceRef} className="receipt-content">
          {/* Receipt Header */}
          <div className="success-icon">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
              className="icon-circle"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <FaCheck className="check-icon" />
              </motion.span>
            </motion.div>
          </div>

          <h2 className="receipt-title">Order Receipt</h2>
          <p className="receipt-subtitle">Thank you for your order!</p>

          {/* Order Details */}
          <div className="section">
            <h3 className="section-title">Order Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Order ID:</span>
                <span className="detail-value">
                  {Math.floor(new Date(orderInfo.orderDate).getTime())}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">
                  {orderInfo.customerDetails?.name || orderInfo.customer?.name || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">
                  {orderInfo.customerDetails?.phone || orderInfo.customer?.phone || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Guests:</span>
                <span className="detail-value">
                  {orderInfo.customerDetails?.guests || orderInfo.customer?.guests || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Table:</span>
                <span className="detail-value">
                  {orderInfo.table?.tableNo || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="section">
            <h3 className="section-title">Items Ordered</h3>
            <div className="items-list">
              {Array.isArray(orderInfo.items) && orderInfo.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">×{item.quantity}</span>
                  </div>
                  <span className="item-price">
                    KSH{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bills Summary */}
          <div className="total-section">
            <div className="total-row">
              <span className="total-label">Subtotal:</span>
              <span className="total-value">
                KSH{orderInfo.bills?.total?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="total-row">
              <span className="total-label">Tax:</span>
              <span className="total-value">
                KSH{orderInfo.bills?.tax?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="total-row grand-total">
              <span>Grand Total:</span>
              <span>
                KSH{orderInfo.bills?.totalWithTax?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="payment-section">
            <h3 className="section-title">Payment Information</h3>
            {orderInfo.paymentMethod === "Cash" ? (
              <div className="payment-method">
                <strong>Payment Method:</strong> {orderInfo.paymentMethod}
              </div>
            ) : (
              <div className="payment-details">
                <div className="payment-row">
                  <span>Payment Method:</span>
                  <span>{orderInfo.paymentMethod}</span>
                </div>
                <div className="payment-row">
                  <span>Razorpay Order ID:</span>
                  <span className="payment-id">
                    {orderInfo.paymentData?.razorpay_order_id}
                  </span>
                </div>
                <div className="payment-row">
                  <span>Razorpay Payment ID:</span>
                  <span className="payment-id">
                    {orderInfo.paymentData?.razorpay_payment_id}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="invoice-actions">
          <button
            onClick={handlePrint}
            className="print-button"
          >
            <FaPrint className="button-icon" />
            Print Receipt
          </button>
          <button
            onClick={() => setShowInvoice(false)}
            className="close-button"
          >
            <FaTimes className="button-icon" />
            Close
          </button>
        </div>
      </motion.div>

      <style jsx>{`
        .invoice-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }

        .invoice-container {
          background: var(--card-bg);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          width: 100%;
          max-width: 450px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .receipt-content {
          padding: 1rem 0;
        }

        .success-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 20px rgba(44, 85, 48, 0.3);
        }

        .check-icon {
          font-size: 2rem;
        }

        .receipt-title {
          text-align: center;
          color: var(--primary);
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .receipt-subtitle {
          text-align: center;
          color: var(--text-secondary);
          margin: 0 0 2rem 0;
          font-size: 1rem;
        }

        .section {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .section-title {
          color: var(--primary);
          font-weight: 600;
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
        }

        .details-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-label {
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .detail-value {
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .item-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .item-name {
          color: var(--text-primary);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .item-quantity {
          color: var(--text-secondary);
          font-size: 0.8rem;
          background: var(--border-color);
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
        }

        .item-price {
          color: var(--primary);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .total-section {
          background: #f8f9fa;
          padding: 1.25rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          margin: 1.5rem 0;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .total-row:last-child {
          margin-bottom: 0;
        }

        .total-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .total-value {
          color: var(--text-primary);
          font-weight: 600;
        }

        .grand-total {
          color: var(--primary);
          font-size: 1.1rem;
          font-weight: 700;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-color);
        }

        .payment-section {
          background: #f0fdf4;
          padding: 1.25rem;
          border-radius: 12px;
          border: 1px solid #bbf7d0;
        }

        .payment-method {
          color: var(--text-primary);
          font-weight: 500;
        }

        .payment-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .payment-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
        }

        .payment-id {
          color: var(--text-secondary);
          font-family: monospace;
          font-size: 0.8rem;
          word-break: break-all;
          text-align: right;
          max-width: 60%;
        }

        .invoice-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .print-button, .close-button {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .print-button {
          background: var(--primary);
          color: white;
        }

        .print-button:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(44, 85, 48, 0.3);
        }

        .close-button {
          background: var(--card-bg);
          color: var(--text-primary);
          border: 1.5px solid var(--border-color);
        }

        .close-button:hover {
          background: #f8f9fa;
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        .button-icon {
          font-size: 0.875rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .invoice-container {
            padding: 1.5rem;
            margin: 1rem;
          }

          .invoice-actions {
            flex-direction: column;
          }

          .icon-circle {
            width: 70px;
            height: 70px;
          }

          .check-icon {
            font-size: 1.75rem;
          }

          .receipt-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .invoice-container {
            padding: 1.25rem;
          }

          .receipt-content {
            padding: 0.5rem 0;
          }

          .section {
            margin-bottom: 1.25rem;
            padding-bottom: 1.25rem;
          }

          .total-section, .payment-section {
            padding: 1rem;
          }

          .item-row {
            padding: 0.625rem;
          }

          .print-button, .close-button {
            padding: 0.875rem 1.25rem;
            font-size: 0.9rem;
          }
        }

        /* Custom scrollbar */
        .invoice-container::-webkit-scrollbar {
          width: 6px;
        }

        .invoice-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .invoice-container::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }

        .invoice-container::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default Invoice;