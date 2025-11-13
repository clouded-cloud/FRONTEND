import React, { useState } from "react";
import TableCard from "../components/Tables/TableCard";
import { tables as seedTables } from "../Constants/Index";
import { enqueueSnackbar } from "notistack";
import { useSelector, useDispatch } from "react-redux";
import { addTable, updateTableStatus, clearAllTables } from "../redux/slices/tablesSlice";

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

  // Get raw data from Redux
  const rawTablesData = useSelector((state) => state.tables);

  // Normalize to array (safe for .filter, .map, .length)
  const tablesData = normalizeTables(rawTablesData);

  // If Redux has no tables or it's malformed, fall back to seeded constants
  const finalTables = Array.isArray(tablesData) && tablesData.length > 0 ? tablesData : seedTables;

  // No remote query for now — read directly from Redux
  const isLoading = false;

  // Debug: expose the raw Redux value so it's easy to see persisted/malformed state
  // Open the browser console to inspect `rawTablesData` as well.
  // If you see unexpected values here, consider clearing `localStorage` key `persist:root`.
  // eslint-disable-next-line no-console
  console.debug("rawTablesData:", rawTablesData);

  // Filter tables based on status
  const filteredTables=
    status === "all"
      ? finalTables
      : finalTables.filter(
          (table) => (table?.status || "").toLowerCase() === status.toLowerCase()
        );

  // Handlers
  const handleAddTable = () => {
    dispatch(addTable());
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Table Management
          </h1>
          <p className="text-gray-600">Select a table to start taking orders</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddTable}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
            >
              Add New Table
            </button>
            <button
              onClick={clearTablesData}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
            >
              Clear All Tables
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setStatus("all")}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
              status === "all"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Tables ({tablesData.length})
          </button>

          <button
            onClick={() => setStatus("available")}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
              status === "available"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Available ({availableCount})
          </button>

          <button
            onClick={() => setStatus("booked")}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
              status === "booked"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Booked ({bookedCount})
          </button>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading tables...</p>
              </div>
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
            <div className="col-span-full flex items-center justify-center py-16">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">Chair</div>
                <p className="text-gray-600 text-xl">No tables found</p>
                <p className="text-gray-500 mt-2">
                  Try changing the filter or add a new table.
                </p>
                {/* Helpful debug: show the raw Redux tables state */}
                <div className="mt-6 text-left bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-700 font-semibold mb-2">Debug: Redux `tables` value</p>
                  <pre className="text-xs text-gray-700 max-h-48 overflow-auto">{JSON.stringify(rawTablesData, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tables;