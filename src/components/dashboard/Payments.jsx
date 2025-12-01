import React from "react";

const Payments = () => {
  return (
    <div className="payments-container">
      <div className="payments-content">
        {/* Header */}
        <div className="payments-header">
          <div>
            <h2 className="payments-title">
              Payment Overview
            </h2>
            <p className="payments-subtitle">
              Track payment methods and transaction details.
            </p>
          </div>
          <button className="time-filter-button">
            Last 1 Month
            <svg
              className="filter-chevron"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Payment Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card total-payments">
            <div className="metric-header">
              <p className="metric-label">Total Payments</p>
              <div className="metric-trend positive">
                <svg className="trend-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M5 15l7-7 7 7" />
                </svg>
                <p className="trend-value">15%</p>
              </div>
            </div>
            <p className="metric-amount">KSH 125,000</p>
          </div>

          <div className="metric-card cash-payments">
            <div className="metric-header">
              <p className="metric-label">Cash Payments</p>
              <div className="metric-trend positive">
                <svg className="trend-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M5 15l7-7 7 7" />
                </svg>
                <p className="trend-value">20%</p>
              </div>
            </div>
            <p className="metric-amount">KSH 75,000</p>
          </div>

          <div className="metric-card card-payments">
            <div className="metric-header">
              <p className="metric-label">Card Payments</p>
              <div className="metric-trend positive">
                <svg className="trend-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M5 15l7-7 7 7" />
                </svg>
                <p className="trend-value">10%</p>
              </div>
            </div>
            <p className="metric-amount">KSH 40,000</p>
          </div>

          <div className="metric-card upi-payments">
            <div className="metric-header">
              <p className="metric-label">Digital Payments</p>
              <div className="metric-trend negative">
                <svg className="trend-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
                <p className="trend-value">5%</p>
              </div>
            </div>
            <p className="metric-amount">KSH 10,000</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="transactions-section">
          <h2 className="transactions-title">
            Recent Transactions
          </h2>
          <div className="table-container">
            <table className="transactions-table">
              <thead className="table-header">
                <tr>
                  <th className="table-th">Transaction ID</th>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Amount</th>
                  <th className="table-th">Method</th>
                  <th className="table-th">Date & Time</th>
                  <th className="table-th">Status</th>
                </tr>
              </thead>
              <tbody className="table-body">
                <tr className="table-row">
                  <td className="table-td">#TXN001</td>
                  <td className="table-td">Gachagua Rigathe</td>
                  <td className="table-td amount">KSH 250</td>
                  <td className="table-td">
                    <span className="payment-method cash">Cash</span>
                  </td>
                  <td className="table-td">Jan 18, 2025 08:32 PM</td>
                  <td className="table-td">
                    <span className="status-badge completed">Completed</span>
                  </td>
                </tr>
                <tr className="table-row">
                  <td className="table-td">#TXN002</td>
                  <td className="table-td">John Ruto</td>
                  <td className="table-td amount">KSH 180</td>
                  <td className="table-td">
                    <span className="payment-method card">Card</span>
                  </td>
                  <td className="table-td">Jan 18, 2025 08:45 PM</td>
                  <td className="table-td">
                    <span className="status-badge completed">Completed</span>
                  </td>
                </tr>
                <tr className="table-row">
                  <td className="table-td">#TXN003</td>
                  <td className="table-td">Emma Smith</td>
                  <td className="table-td amount">KSH 120</td>
                  <td className="table-td">
                    <span className="payment-method digital">Digital</span>
                  </td>
                  <td className="table-td">Jan 18, 2025 09:00 PM</td>
                  <td className="table-td">
                    <span className="status-badge completed">Completed</span>
                  </td>
                </tr>
                <tr className="table-row">
                  <td className="table-td">#TXN004</td>
                  <td className="table-td">Chris Brown</td>
                  <td className="table-td amount">KSH 220</td>
                  <td className="table-td">
                    <span className="payment-method cash">Cash</span>
                  </td>
                  <td className="table-td">Jan 18, 2025 09:15 PM</td>
                  <td className="table-td">
                    <span className="status-badge pending">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .payments-container {
          padding: 1.5rem;
          font-family: 'Inter', sans-serif;
          background: var(--bg-body);
          min-height: 100vh;
        }

        .payments-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header */
        .payments-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .payments-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .payments-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
        }

        .time-filter-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: var(--card-bg);
          color: var(--text-primary);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .time-filter-button:hover {
          border-color: var(--primary);
          background: #f8f9fa;
        }

        .filter-chevron {
          width: 1rem;
          height: 1rem;
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .metric-card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .metric-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .total-payments::before {
          background: var(--primary);
        }

        .cash-payments::before {
          background: #28a745;
        }

        .card-payments::before {
          background: #ffc107;
        }

        .upi-payments::before {
          background: #dc3545;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .metric-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .metric-trend.positive {
          color: #28a745;
        }

        .metric-trend.negative {
          color: #dc3545;
        }

        .trend-icon {
          width: 0.875rem;
          height: 0.875rem;
        }

        .metric-amount {
          color: var(--text-primary);
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
        }

        /* Transactions Section */
        .transactions-section {
          margin-top: 2rem;
        }

        .transactions-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 1.5rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--border-color);
        }

        .table-container {
          overflow-x: auto;
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .table-container:hover {
          box-shadow: var(--shadow-lg);
        }

        .transactions-table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-header {
          background: #f8f9fa;
          border-bottom: 2px solid var(--border-color);
        }

        .table-th {
          padding: 1rem 1.5rem;
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
        }

        .table-body {
          background: var(--card-bg);
        }

        .table-row {
          border-bottom: 1px solid var(--border-color);
          transition: all 0.2s ease;
        }

        .table-row:hover {
          background: #f8f9fa;
          transform: translateX(4px);
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-td {
          padding: 1.25rem 1.5rem;
          color: var(--text-primary);
          font-size: 0.95rem;
          text-align: left;
        }

        .amount {
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Payment Method Badges */
        .payment-method {
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
        }

        .payment-method.cash {
          background: #f0fdf4;
          color: #28a745;
          border: 1px solid #bbf7d0;
        }

        .payment-method.card {
          background: #fefce8;
          color: #eab308;
          border: 1px solid #fef08a;
        }

        .payment-method.digital {
          background: #eff6ff;
          color: var(--primary);
          border: 1px solid var(--border-color);
        }

        /* Status Badges */
        .status-badge {
          padding: 0.5rem 0.875rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
        }

        .status-badge.completed {
          background: #f0fdf4;
          color: #28a745;
          border: 1px solid #bbf7d0;
        }

        .status-badge.pending {
          background: #fefce8;
          color: #eab308;
          border: 1px solid #fef08a;
        }

        /* Custom scrollbar for table */
        .table-container::-webkit-scrollbar {
          height: 8px;
        }

        .table-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .table-container::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 4px;
        }

        .table-container::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        /* Animation for table rows */
        .table-row {
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

        /* Stagger animation for table rows */
        .table-row:nth-child(1) { animation-delay: 0.1s; }
        .table-row:nth-child(2) { animation-delay: 0.2s; }
        .table-row:nth-child(3) { animation-delay: 0.3s; }
        .table-row:nth-child(4) { animation-delay: 0.4s; }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .payments-container {
            padding: 1rem;
          }

          .payments-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .payments-title {
            font-size: 1.5rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .metric-card {
            padding: 1.25rem;
          }

          .metric-amount {
            font-size: 1.5rem;
          }

          .table-th, .table-td {
            padding: 1rem;
          }

          .transactions-title {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 640px) {
          .table-container {
            border-radius: 12px;
          }

          .table-th, .table-td {
            padding: 0.75rem 0.5rem;
            font-size: 0.8rem;
          }

          .payment-method, .status-badge {
            font-size: 0.7rem;
            padding: 0.25rem 0.5rem;
          }

          .metric-label {
            font-size: 0.8rem;
          }

          .metric-amount {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .payments-title {
            font-size: 1.25rem;
          }

          .payments-subtitle {
            font-size: 0.9rem;
          }

          .time-filter-button {
            padding: 0.625rem 0.875rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Payments;