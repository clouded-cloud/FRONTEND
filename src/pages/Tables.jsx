import React, { useState, useEffect } from "react";
import TableCard from "../components/Tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https/Index.js";
import { enqueueSnackbar } from "notistack";

const Tables = () => {
  const [status, setStatus] = useState("all");
  const [tablesData, setTablesData] = useState([
    { id: 1, tableNo: 1, status: "available", seats: 4, current_order_customer_name: null },
    { id: 2, tableNo: 2, status: "booked", seats: 6, current_order_customer_name: "John Doe" },
    { id: 3, tableNo: 3, status: "available", seats: 2, current_order_customer_name: null },
    { id: 4, tableNo: 4, status: "booked", seats: 4, current_order_customer_name: "Jane Smith" },
    { id: 5, tableNo: 5, status: "available", seats: 8, current_order_customer_name: null },
    { id: 6, tableNo: 6, status: "available", seats: 4, current_order_customer_name: null },
    { id: 7, tableNo: 7, status: "booked", seats: 6, current_order_customer_name: "Alice Brown" },
    { id: 8, tableNo: 8, status: "available", seats: 2, current_order_customer_name: null },
  ]);

  useEffect(() => {
    document.title = "POS | Tables"
  }, [])

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      // Return mock data for development - backend not required
      return { data: tablesData };
    },
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log('Tables API Response:', resData);

  // Use local state for tables data
  const currentTablesData = tablesData;

  // Filter tables based on status
  const filteredTables = status === "all"
    ? tablesData
    : tablesData.filter(table => table.status?.toLowerCase() === status.toLowerCase());

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Table Management</h1>
          <p className="text-gray-600">Select a table to start taking orders</p>
          <button
            onClick={() => {
              const newTableNo = Math.max(...tablesData.map(t => t.tableNo)) + 1;
              const newTable = {
                id: Date.now(),
                tableNo: newTableNo,
                status: "available",
                seats: 4,
                current_order_customer_name: null
              };
              setTablesData([...tablesData, newTable]);
              enqueueSnackbar(`Table ${newTableNo} added successfully!`, { variant: "success" });
            }}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
          >
            Add New Table
          </button>
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
            Available ({tablesData.filter(t => t.status?.toLowerCase() === "available").length})
          </button>
          <button
            onClick={() => setStatus("booked")}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
              status === "booked"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Booked ({tablesData.filter(t => t.status?.toLowerCase() === "booked").length})
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
          ) : Array.isArray(filteredTables) && filteredTables.length > 0 ? (
            filteredTables.map((table) => (
              <TableCard
                key={table._id || table.id}
                id={table.id}
                name={table.tableNo}
                status={table.status}
                initials={table?.current_order_customer_name}
                seats={table.seats}
              />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-16">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">🪑</div>
                <p className="text-gray-600 text-xl">No tables found</p>
                <p className="text-gray-500 mt-2">Try changing the filter or check your connection</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tables;