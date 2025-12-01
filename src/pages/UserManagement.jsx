import React from "react";
import UserManagement from "../components/dashboard/UserManagement";

const UserManagementPage = () => {
  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-main">
            <div className="title-section">
              <h1 className="page-title">User Management</h1>
              <div className="title-accent"></div>
            </div>
            <p className="page-subtitle">
              Manage system users and their permissions
            </p>
          </div>
          <div className="header-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
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
          background: linear-gradient(135deg, var(--card-bg) 0%, rgba(44, 85, 48, 0.03) 100%);
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          padding: 2rem 0 0 0;
          position: relative;
          overflow: hidden;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          position: relative;
          z-index: 2;
        }

        .header-main {
          flex: 1;
        }

        .title-section {
          position: relative;
          margin-bottom: 0.75rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        .title-accent {
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--primary-light));
          border-radius: 2px;
        }

        .page-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
          line-height: 1.5;
          max-width: 600px;
        }

        .header-decoration {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .decoration-circle {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary-light);
          opacity: 0.6;
          animation: pulse 2s ease-in-out infinite;
        }

        .decoration-circle:nth-child(2) {
          animation-delay: 0.5s;
          background: var(--secondary);
        }

        .decoration-circle:nth-child(3) {
          animation-delay: 1s;
          background: var(--primary);
        }

        /* Content Section */
        .page-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        /* Enhanced UserManagement component integration */
        .page-content :global(.user-management-container) {
          background: var(--card-bg);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .page-content :global(.user-management-header) {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          color: white;
          padding: 1.5rem 2rem;
        }

        .page-content :global(.user-management-header h2) {
          color: white;
          margin: 0;
          font-weight: 700;
        }

        .page-content :global(.user-management-actions .btn-primary) {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          border: none;
          box-shadow: 0 4px 12px rgba(44, 85, 48, 0.3);
        }

        .page-content :global(.user-management-actions .btn-primary:hover) {
          background: linear-gradient(135deg, var(--primary-hover), var(--primary));
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(44, 85, 48, 0.4);
        }

        .page-content :global(.user-management-actions .btn-outline) {
          border-color: var(--primary);
          color: var(--primary);
        }

        .page-content :global(.user-management-actions .btn-outline:hover) {
          background: var(--primary);
          color: white;
        }

        .page-content :global(.user-table) {
          border-color: var(--border-color);
        }

        .page-content :global(.user-table th) {
          background: var(--bg-body);
          color: var(--text-primary);
          font-weight: 600;
          border-color: var(--border-color);
        }

        .page-content :global(.user-table td) {
          border-color: var(--border-color);
          color: var(--text-secondary);
        }

        .page-content :global(.user-table tr:hover) {
          background: rgba(44, 85, 48, 0.02);
        }

        .page-content :global(.status-badge) {
          border-radius: 20px;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .page-content :global(.status-active) {
          background: rgba(40, 167, 69, 0.1);
          color: var(--success);
          border: 1px solid rgba(40, 167, 69, 0.2);
        }

        .page-content :global(.status-inactive) {
          background: rgba(108, 117, 125, 0.1);
          color: var(--text-secondary);
          border: 1px solid rgba(108, 117, 125, 0.2);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .header-content {
            flex-direction: column;
            gap: 1.5rem;
          }

          .header-decoration {
            align-self: flex-start;
          }
        }

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

          .page-content :global(.user-management-header) {
            padding: 1.25rem 1.5rem;
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

          .title-accent {
            width: 40px;
            height: 3px;
          }

          .page-content :global(.user-management-header) {
            padding: 1rem 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.375rem;
          }

          .page-subtitle {
            font-size: 0.9rem;
          }

          .header-decoration {
            display: none;
          }
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .page-container {
          animation: fadeIn 0.4s ease-out;
        }

        .page-header {
          animation: fadeIn 0.5s ease-out;
        }

        .page-content {
          animation: fadeIn 0.6s ease-out;
        }

        /* Focus states for accessibility */
        .page-container :global(button):focus,
        .page-container :global(input):focus,
        .page-container :global(select):focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .page-container,
          .page-header,
          .page-content {
            animation: none;
          }

          .decoration-circle {
            animation: none;
          }

          .page-content :global(.user-management-actions .btn-primary:hover) {
            transform: none;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .page-header {
            border-bottom-width: 2px;
          }

          .title-accent {
            height: 4px;
          }

          .page-content :global(.user-management-container) {
            border-width: 2px;
          }

          .page-content :global(.user-table) {
            border-width: 2px;
          }

          .page-content :global(.user-table th),
          .page-content :global(.user-table td) {
            border-width: 2px;
          }
        }

        /* Dark mode enhancements */
        @media (prefers-color-scheme: dark) {
          .page-header {
            background: linear-gradient(135deg, var(--card-bg) 0%, rgba(44, 85, 48, 0.08) 100%);
          }

          .page-content :global(.user-table tr:hover) {
            background: rgba(44, 85, 48, 0.05);
          }
        }
      `}</style>
    </div>
  );
};

export default UserManagementPage;
