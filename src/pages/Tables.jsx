import React, { useState, useEffect } from "react";
import TableCard from "../components/Tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https/Index.js";
import { enqueueSnackbar } from "notistack";

const Tables = () => {
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Tables"
  }, [])

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  if(isError) {
    enqueueSnackbar("Something went wrong!", {variant: "error"})
  }

  console.log('Tables API Response:', resData);

  // ✅ Safe data extraction
  const tablesData = resData?.data?.data ||
                    resData?.data?.tables ||
                    resData?.tables ||
                    resData?.data ||
                    [];

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
                id={table._id}
                name={table.tableNo}
                status={table.status}
                initials={table?.currentOrder?.customerDetails?.name}
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