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
          color: "var(--success)",
          bg: "rgba(40, 167, 69, 0.1)",
          border: "rgba(40, 167, 69, 0.3)",
          icon: "🟢"
        };
      case "booked":
        return {
          color: "var(--danger)",
          bg: "rgba(220, 53, 69, 0.1)",
          border: "rgba(220, 53, 69, 0.3)",
          icon: "🔴"
        };
      case "occupied":
        return {
          color: "var(--warning)",
          bg: "rgba(255, 193, 7, 0.1)",
          border: "rgba(255, 193, 7, 0.3)",
          icon: "🟡"
        };
      default:
        return {
          color: "var(--text-secondary)",
          bg: "var(--bg-body)",
          border: "var(--border-color)",
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
          border-radius: 12px;
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
          transition: transform 0.3s ease;
        }

        .table-card:hover .table-arrow {
          transform: translateX(4px);
          color: var(--primary-hover);
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
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
          background: linear-gradient(135deg, var(--primary), var(--primary-light)) !important;
        }

        .table-card:hover .table-avatar {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(44, 85, 48, 0.3);
        }

        .table-card-disabled:hover .table-avatar {
          transform: none;
          box-shadow: var(--shadow);
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
          background: var(--bg-body);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .table-card:hover .seats-info {
          background: rgba(44, 85, 48, 0.05);
          border-color: var(--primary-light);
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
          border-radius: 12px;
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

        /* Available table highlight */
        .table-card:not(.table-card-disabled) {
          position: relative;
        }

        .table-card:not(.table-card-disabled)::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), var(--primary-light));
          border-radius: 12px 12px 0 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .table-card:not(.table-card-disabled):hover::before {
          opacity: 1;
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
            border-radius: 10px;
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

          .table-card {
            padding: 0.875rem;
          }
        }

        /* Animation for available tables */
        @keyframes subtlePulse {
          0%, 100% { 
            box-shadow: var(--shadow);
          }
          50% { 
            box-shadow: 0 4px 15px rgba(44, 85, 48, 0.15);
          }
        }

        .table-card:not(.table-card-disabled) {
          animation: subtlePulse 3s ease-in-out infinite;
        }

        /* Enhanced hover effects for available tables */
        .table-card:not(.table-card-disabled):hover {
          background: linear-gradient(135deg, var(--card-bg) 0%, rgba(44, 85, 48, 0.02) 100%);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .table-card,
          .table-avatar,
          .table-arrow,
          .seats-info {
            transition: none;
            animation: none;
          }

          .table-card:not(.table-card-disabled)::before {
            display: none;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .table-card {
            border-width: 2px;
          }

          .table-status {
            border-width: 2px;
          }

          .seats-info {
            border-width: 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default TableCard;