import React from "react";
import UserManagement from "../components/dashboard/UserManagement";

const UserManagementPage = () => {
  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-main">
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">
              Manage system users and their permissions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-content">
        <UserManagement />
      </div>

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background: var(--bg-body);
          font-family: 'Inter', sans-serif;
        }

        /* Header Section */
        .page-header {
          background: var(--card-bg);
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          padding: 2rem 0 0 0;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .header-main {
          flex: 1;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .page-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
          line-height: 1.5;
        }

        /* Content Section */
        .page-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        /* Ensure the UserManagement component integrates well */
        .page-content :global(.user-management-container) {
          background: var(--card-bg);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .page-header {
            padding: 1.5rem 0 0 0;
          }

          .header-content {
            padding: 0 1.25rem;
          }

          .page-title {
            font-size: 1.75rem;
          }

          .page-subtitle {
            font-size: 0.95rem;
          }

          .page-content {
            padding: 1.5rem 1.25rem;
          }
        }

        @media (max-width: 640px) {
          .header-content {
            padding: 0 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .page-content {
            padding: 1.25rem 1rem;
          }
        }

        /* Animations */
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

        .page-container {
          animation: fadeIn 0.3s ease-out;
        }

        /* Focus states for accessibility */
        .page-container :global(button):focus,
        .page-container :global(input):focus,
        .page-container :global(select):focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--focus-ring);
        }
      `}</style>
    </div>
  );
};

export default UserManagementPage;
