import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils"
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight, FaUsers, FaChair } from "react-icons/fa";

const TableCard = ({id, name, status, initials, seats}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleClick = (name) => {
    if(status?.toLowerCase() === "booked") return;

    const table = { tableId: id, tableNo: name }
    dispatch(updateTable({table}))
    navigate(`/menu`);
  };

  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "available":
        return {
          color: "#16a34a",
          bg: "#f0fdf4",
          border: "#bbf7d0",
          icon: "🟢"
        };
      case "booked":
        return {
          color: "#dc2626",
          bg: "#fef2f2",
          border: "#fecaca",
          icon: "🔴"
        };
      case "occupied":
        return {
          color: "#eab308",
          bg: "#fefce8",
          border: "#fef08a",
          icon: "🟡"
        };
      default:
        return {
          color: "#6b7280",
          bg: "#f8fafc",
          border: "#e5e7eb",
          icon: "⚫"
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const isAvailable = status?.toLowerCase() === "available";

  return (
    <div className="table-card-container">
      <div 
        onClick={() => handleClick(name)}
        className={`table-card ${!isAvailable ? 'table-card-disabled' : ''}`}
      >
        {/* Header */}
        <div className="table-header">
          <div className="table-title-section">
            <h3 className="table-title">Table {name}</h3>
            {isAvailable && (
              <FaLongArrowAltRight className="table-arrow" />
            )}
          </div>
          <div 
            className="table-status"
            style={{
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
              borderColor: statusConfig.border
            }}
          >
            <span className="status-icon">{statusConfig.icon}</span>
            <span className="status-text">{status}</span>
          </div>
        </div>

        {/* Avatar */}
        <div className="table-avatar-section">
          <div 
            className="table-avatar"
            style={{ 
              backgroundColor: initials ? getBgColor() : "var(--text-muted)",
              color: 'white'
            }}
          >
            {getAvatarName(initials) || "N/A"}
          </div>
        </div>

        {/* Footer */}
        <div className="table-footer">
          <div className="seats-info">
            <FaUsers className="seats-icon" />
            <span className="seats-text">
              <span className="seats-count">{seats}</span> seats
            </span>
          </div>
          
          {!isAvailable && (
            <div className="unavailable-overlay">
              <div className="unavailable-content">
                <FaChair className="unavailable-icon" />
                <span className="unavailable-text">Currently {status?.toLowerCase()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .table-card-container {
          width: 100%;
        }

        .table-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow);
        }

        .table-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }

        .table-card-disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .table-card-disabled:hover {
          transform: none;
          box-shadow: var(--shadow);
          border-color: var(--border-color);
        }

        /* Header */
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .table-title-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .table-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.2;
        }

        .table-arrow {
          color: var(--primary);
          font-size: 1.125rem;
          transition: transform 0.2s ease;
        }

        .table-card:hover .table-arrow {
          transform: translateX(4px);
        }

        .table-card-disabled:hover .table-arrow {
          transform: none;
        }

        .table-status {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          border: 1.5px solid;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-icon {
          font-size: 0.625rem;
        }

        .status-text {
          font-size: 0.75rem;
        }

        /* Avatar */
        .table-avatar-section {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .table-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .table-card:hover .table-avatar {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .table-card-disabled:hover .table-avatar {
          transform: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Footer */
        .table-footer {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .seats-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #f8f9ff;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .seats-icon {
          color: var(--primary);
          font-size: 0.875rem;
        }

        .seats-text {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .seats-count {
          color: var(--text-primary);
          font-weight: 700;
          margin-right: 0.25rem;
        }

        /* Unavailable Overlay */
        .unavailable-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .table-card-disabled:hover .unavailable-overlay {
          opacity: 1;
        }

        .unavailable-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
        }

        .unavailable-icon {
          color: var(--text-muted);
          font-size: 1.5rem;
        }

        .unavailable-text {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        /* Focus states for accessibility */
        .table-card:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .table-card {
            padding: 1.25rem;
          }

          .table-avatar {
            width: 70px;
            height: 70px;
            font-size: 1.25rem;
          }
        }

        @media (max-width: 768px) {
          .table-card {
            padding: 1rem;
            border-radius: 12px;
          }

          .table-header {
            margin-bottom: 1.25rem;
          }

          .table-title {
            font-size: 1.125rem;
          }

          .table-avatar {
            width: 60px;
            height: 60px;
            font-size: 1.125rem;
          }

          .seats-info {
            padding: 0.625rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .table-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .table-status {
            align-self: flex-start;
          }

          .table-avatar-section {
            margin-bottom: 1.25rem;
          }
        }

        /* Animation for available tables */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .table-card:not(.table-card-disabled) {
          animation: pulse 3s ease-in-out infinite;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .table-card,
          .table-avatar,
          .table-arrow {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default TableCard;