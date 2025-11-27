import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory, MdDashboard, MdReceipt, MdPayment } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import Metrics from "../components/dashboard/Metrics";
import RecentOrdersNew from "../components/dashboard/RecentOrdersNew";
import Payments from "../components/dashboard/Payments";
import Modal from "../components/dashboard/Modal";

const tabs = [
  { key: "Metrics", label: "Dashboard", icon: <MdDashboard size={18} /> },
  { key: "Orders", label: "Recent Orders", icon: <MdReceipt size={18} /> },
  { key: "Payments", label: "Payments", icon: <MdPayment size={18} /> }
];

const quickActions = [
  { label: "Add Table", icon: <MdTableBar size={18} />, action: "table" },
  { label: "Add Category", icon: <MdCategory size={18} />, action: "category" },
  { label: "Add Dish", icon: <BiSolidDish size={18} />, action: "dishes" }
];

const Dashboard = () => {
  useEffect(() => {
    document.title = "POS | Admin Dashboard"
  }, [])

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Metrics");

  const handleOpenModal = (action) => {
    if (action === "table") setIsTableModalOpen(true);
    if (action === "category") setIsCategoryModalOpen(true);
    if (action === "dishes") setIsDishModalOpen(true);
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-main">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">
              Manage your restaurant operations and track performance
            </p>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            {quickActions.map(({ label, icon, action }) => (
              <button
                key={action}
                onClick={() => handleOpenModal(action)}
                className="quick-action-button"
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="navigation-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`nav-tab ${activeTab === tab.key ? 'nav-tab-active' : 'nav-tab-inactive'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="dashboard-content">
        {activeTab === "Metrics" && <Metrics />}
        {activeTab === "Orders" && <RecentOrdersNew />}
        {activeTab === "Payments" && <Payments />}
      </div>

      {/* Modals */}
      {isTableModalOpen && (
        <Modal 
          setIsTableModalOpen={setIsTableModalOpen} 
          type="table" 
        />
      )}
      {isCategoryModalOpen && (
        <Modal 
          setIsTableModalOpen={setIsCategoryModalOpen} 
          type="category" 
        />
      )}
      {isDishModalOpen && (
        <Modal 
          setIsTableModalOpen={setIsDishModalOpen} 
          type="dish" 
        />
      )}

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: var(--bg-body);
          font-family: 'Inter', sans-serif;
        }

        /* Header Section */
        .dashboard-header {
          background: var(--card-bg);
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          padding: 2rem 0 0 0;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
        }

        .header-main {
          flex: 1;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .dashboard-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
          line-height: 1.5;
        }

        /* Quick Actions */
        .quick-actions {
          display: flex;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .quick-action-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
        }

        .quick-action-button:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(13, 110, 253, 0.4);
        }

        /* Navigation Tabs */
        .navigation-tabs {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          gap: 0.5rem;
          margin-top: 2rem;
          overflow-x: auto;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 12px 12px 0 0;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          background: transparent;
          color: var(--text-secondary);
          border-bottom: 3px solid transparent;
        }

        .nav-tab-active {
          background: var(--card-bg);
          color: var(--primary);
          border-bottom-color: var(--primary);
          box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
        }

        .nav-tab-inactive:hover {
          color: var(--text-primary);
          background: #f8f9ff;
          border-bottom-color: var(--border-color);
        }

        /* Content Section */
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .header-content {
            flex-direction: column;
            gap: 1.5rem;
          }

          .quick-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .navigation-tabs {
            margin-top: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 1.5rem 0 0 0;
          }

          .header-content {
            padding: 0 1.25rem;
          }

          .dashboard-title {
            font-size: 1.75rem;
          }

          .dashboard-subtitle {
            font-size: 0.95rem;
          }

          .quick-actions {
            flex-wrap: wrap;
          }

          .quick-action-button {
            padding: 0.625rem 1rem;
            font-size: 0.8rem;
          }

          .navigation-tabs {
            padding: 0 1.25rem;
            margin-top: 1.25rem;
          }

          .nav-tab {
            padding: 0.875rem 1.25rem;
            font-size: 0.875rem;
          }

          .dashboard-content {
            padding: 1.5rem 1.25rem;
          }
        }

        @media (max-width: 640px) {
          .quick-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .quick-action-button {
            justify-content: center;
          }

          .navigation-tabs {
            gap: 0.25rem;
          }

          .nav-tab {
            padding: 0.75rem 1rem;
            font-size: 0.8rem;
          }

          .nav-tab span {
            display: none;
          }

          .nav-tab svg {
            margin: 0;
          }
        }

        @media (max-width: 480px) {
          .header-content {
            padding: 0 1rem;
          }

          .dashboard-title {
            font-size: 1.5rem;
          }

          .navigation-tabs {
            padding: 0 1rem;
          }

          .dashboard-content {
            padding: 1.25rem 1rem;
          }
        }

        /* Custom scrollbar for navigation */
        .navigation-tabs::-webkit-scrollbar {
          height: 4px;
        }

        .navigation-tabs::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }

        .navigation-tabs::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 2px;
        }

        .navigation-tabs::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        /* Focus states for accessibility */
        .quick-action-button:focus,
        .nav-tab:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        /* Loading state animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dashboard-content > * {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;