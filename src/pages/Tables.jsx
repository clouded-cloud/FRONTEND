import React, { useState, useMemo } from "react";
import TableCard from "../components/Tables/TableCard";
import { tables as seedTables } from "../Constants/Index";
import { useSnackbar } from "notistack";
import { useSelector, useDispatch } from "react-redux";
import { addNewTable, updateTableStatus, clearAllTables } from "../redux/slices/tablesSlice";

// Helper: Always return an array from Redux state
const normalizeTables = (tables) => {
  if (Array.isArray(tables)) return tables;
  if (tables?.ids && tables?.entities) {
    return tables.ids
      .map((id) => tables.entities[id])
      .filter((table) => table != null);
  }
  return [];
};

const Tables = () => {
  const [status, setStatus] = useState("all");
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // Get raw data from Redux
  const rawTablesData = useSelector((state) => state.tables);

  // Normalize to array (safe for .filter, .map, .length)
  const tablesData = normalizeTables(rawTablesData);

  // If Redux has no tables or it's malformed, fall back to seeded constants
  const finalTables = Array.isArray(tablesData) && tablesData.length > 0 ? tablesData : seedTables;

  // No remote query for now — read directly from Redux
  const isLoading = false;

  // Debug: expose the raw Redux value so it's easy to see persisted/malformed state
  console.debug("rawTablesData:", rawTablesData);

  // Filter tables based on status
  const filteredTables = useMemo(() => 
    status === "all"
      ? finalTables
      : finalTables.filter(
          (table) => (table?.status || "").toLowerCase() === status.toLowerCase()
        ),
    [status, finalTables]
  );

  // Handlers
  const handleAddNewTable = () => {
    dispatch(addNewTable());
    enqueueSnackbar("Table added successfully!", { variant: "success" });
  };

  const handleTableStatusChange = (tableId, newStatus, customerName = null) => {
    dispatch(updateTableStatus({ tableId, status: newStatus, customerName }));
  };

  const clearTablesData = () => {
    dispatch(clearAllTables());
    enqueueSnackbar("All tables data cleared", { variant: "warning" });
  };

  // Count helpers (safe)
  const availableCount = finalTables.filter(
    (t) => (t?.status || "").toLowerCase() === "available"
  ).length;

  const bookedCount = finalTables.filter(
    (t) => (t?.status || "").toLowerCase() === "booked"
  ).length;

  // Filter buttons configuration with theme colors
  const filterButtons = [
    { key: "all", label: "All Tables", count: finalTables.length },
    { key: "available", label: "Available", count: availableCount },
    { key: "booked", label: "Booked", count: bookedCount },
  ];

  return (
    <div className="tables-container">
      <div className="tables-content">
        {/* Header */}
        <div className="tables-header">
          <div className="header-main">
            <h1 className="tables-title">Table Management</h1>
            <p className="tables-subtitle">Select a table to start taking orders</p>
          </div>
          
          <div className="action-buttons">
            <button
              onClick={handleAddNewTable}
              className="btn btn-primary action-button"
            >
              Add New Table
            </button>
            <button
              onClick={clearTablesData}
              className="btn btn-outline action-button"
            >
              Clear All Tables
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {filterButtons.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setStatus(key)}
              className={`filter-button ${status === key ? 'filter-button-active' : 'filter-button-inactive'} filter-${key}`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Tables Grid */}
        <div className="tables-grid">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p className="loading-text">Loading tables...</p>
            </div>
          ) : filteredTables.length > 0 ? (
            filteredTables.map((table) => (
              <TableCard
                key={table.id || table._id}
                id={table.id}
                name={table.tableNo || table.name}
                status={table.status}
                initials={table?.current_order_customer_name || table.initial}
                seats={table.seats}
                onStatusChange={handleTableStatusChange}
              />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <p className="empty-title">No tables found</p>
              <p className="empty-subtitle">
                Try changing the filter or add a new table.
              </p>
              {/* Helpful debug: show the raw Redux tables state */}
              <div className="debug-info">
                <p className="debug-title">Debug: Redux `tables` value</p>
                <pre className="debug-content">{JSON.stringify(rawTablesData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .tables-container {
          min-height: 100vh;
          background: var(--bg-body);
          font-family: 'Inter', sans-serif;
        }

        .tables-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        /* Header Section */
        .tables-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .header-main {
          flex: 1;
        }

        .tables-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .tables-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
          line-height: 1.5;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          flex-shrink: 0;
        }

        .action-button {
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: var(--shadow);
          white-space: nowrap;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        /* Filter Buttons */
        .filter-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .filter-button {
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .filter-button-inactive {
          background: var(--card-bg);
          color: var(--text-secondary);
          border-color: var(--border-color);
        }

        .filter-button-inactive:hover {
          background: rgba(44, 85, 48, 0.05);
          color: var(--text-primary);
          border-color: var(--primary-light);
        }

        .filter-button-active {
          color: white;
          box-shadow: var(--shadow);
        }

        .filter-all.filter-button-active {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
        }

        .filter-available.filter-button-active {
          background: linear-gradient(135deg, var(--success), #22c55e);
        }

        .filter-booked.filter-button-active {
          background: linear-gradient(135deg, var(--danger), #ef4444);
        }

        .filter-button-active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 10px 10px 0 0;
        }

        /* Tables Grid */
        .tables-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        /* Loading State */
        .loading-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background: var(--card-bg);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
        }

        .spinner {
          width: 3rem;
          height: 3rem;
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .loading-text {
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background: var(--card-bg);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          text-align: center;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-title {
          color: var(--text-primary);
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .empty-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
        }

        /* Debug Info */
        .debug-info {
          margin-top: 2rem;
          text-align: left;
          background: var(--bg-body);
          padding: 1.5rem;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          max-width: 600px;
          width: 100%;
        }

        .debug-title {
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
        }

        .debug-content {
          color: var(--text-secondary);
          font-size: 0.75rem;
          margin: 0;
          max-height: 12rem;
          overflow: auto;
          background: var(--card-bg);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

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

        .tables-grid > * {
          animation: fadeIn 0.3s ease-out;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .tables-header {
            flex-direction: column;
            gap: 1.5rem;
          }

          .action-buttons {
            width: 100%;
            justify-content: flex-start;
          }

          .tables-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .tables-content {
            padding: 1.5rem 1.25rem;
          }

          .tables-title {
            font-size: 1.75rem;
          }

          .filter-buttons {
            flex-direction: column;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-button {
            text-align: center;
          }

          .tables-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          }
        }

        @media (max-width: 640px) {
          .tables-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .tables-content {
            padding: 1.25rem 1rem;
          }

          .debug-info {
            padding: 1rem;
          }

          .empty-state {
            padding: 3rem 1.5rem;
          }

          .empty-icon {
            font-size: 3rem;
          }

          .empty-title {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .tables-title {
            font-size: 1.5rem;
          }

          .tables-subtitle {
            font-size: 0.9rem;
          }

          .action-button {
            padding: 0.625rem 1.25rem;
            font-size: 0.85rem;
          }

          .filter-button {
            padding: 0.625rem 1rem;
            font-size: 0.85rem;
          }
        }

        /* Focus states for accessibility */
        .action-button:focus,
        .filter-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        /* Custom scrollbar */
        .debug-content::-webkit-scrollbar {
          width: 6px;
        }

        .debug-content::-webkit-scrollbar-track {
          background: var(--bg-body);
          border-radius: 3px;
        }

        .debug-content::-webkit-scrollbar-thumb {
          background: var(--primary-light);
          border-radius: 3px;
        }

        .debug-content::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .action-button,
          .filter-button {
            transition: none;
          }

          .action-button:hover,
          .filter-button-inactive:hover {
            transform: none;
          }

          .spinner {
            animation: none;
            border-top-color: transparent;
          }

          .tables-grid > * {
            animation: none;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .filter-button {
            border-width: 2px;
          }

          .filter-button-active {
            border-width: 3px;
            border-color: var(--text-primary);
          }

          .debug-info {
            border-width: 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default Tables;