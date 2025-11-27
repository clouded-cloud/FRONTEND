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

  // Filter buttons configuration
  const filterButtons = [
    { key: "all", label: "All Tables", count: tablesData.length, color: "var(--pos-primary)" },
    { key: "available", label: "Available", count: availableCount, color: "var(--pos-success)" },
    { key: "booked", label: "Booked", count: bookedCount, color: "var(--pos-danger)" },
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
              className="action-button success"
            >
              Add New Table
            </button>
            <button
              onClick={clearTablesData}
              className="action-button danger"
            >
              Clear All Tables
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {filterButtons.map(({ key, label, count, color }) => (
            <button
              key={key}
              onClick={() => setStatus(key)}
              className={`filter-button ${status === key ? 'filter-button-active' : 'filter-button-inactive'}`}
              style={status === key ? { backgroundColor: color } : undefined}
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
          background: var(--color-bg);
          color: var(--color-text);
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
          border: 1px solid var(--pos-border);
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
          box-shadow: var(--soft-shadow-2);
        }

        .action-button.success {
          background: var(--pos-success);
        }

        .action-button.danger {
          background: var(--pos-danger);
        }

        .action-button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        /* Filter Buttons */
        .filter-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .filter-button {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .filter-button-active {
          color: white;
          box-shadow: var(--soft-shadow-2);
        }

        .filter-button-inactive {
          background: white;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        .filter-button-inactive:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
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
        }

        .spinner {
          width: 3rem;
          height: 3rem;
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--pos-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .loading-text {
          color: var(--text-secondary);
          font-size: 1.125rem;
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
          background: var(--bg-secondary);
          padding: 1.5rem;
          border-radius: 12px;
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
          background: var(--bg-primary);
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
          background: var(--bg-secondary);
          border-radius: 3px;
        }

        .debug-content::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }

        .debug-content::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default Tables;