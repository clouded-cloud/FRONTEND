import React, { useState, useEffect } from "react";
import OrderCard from "../components/orders/OrderCard.jsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/Index.js";
import { enqueueSnackbar } from "notistack"

const Orders = () => {
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Orders"
  }, [])

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData
  })

  if(isError) {
    enqueueSnackbar("Something went wrong!", {variant: "error"})
  }

  // ✅ Add debugging to see the actual data structure
  console.log('Orders API Response:', resData);

  // ✅ Safe data extraction
  const orders = resData?.data?.orders ||
                resData?.data?.data ||
                resData?.orders ||
                resData?.data ||
                [];

  // Filter orders based on status
  const filteredOrders = status === "all"
    ? orders
    : orders.filter(order => order.status?.toLowerCase() === status.toLowerCase());

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">View and manage all customer orders</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setStatus("all")}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
              status === "all"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setStatus("in progress")}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
              status === "in progress"
                ? "bg-yellow-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            In Progress ({orders.filter(o => o.status?.toLowerCase() === "in progress").length})
          </button>
          <button
            onClick={() => setStatus("ready")}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
              status === "ready"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Ready ({orders.filter(o => o.status?.toLowerCase() === "ready").length})
          </button>
          <button
            onClick={() => setStatus("completed")}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
              status === "completed"
                ? "bg-gray-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Completed ({orders.filter(o => o.status?.toLowerCase() === "completed").length})
          </button>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading orders...</p>
              </div>
            </div>
          ) : Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order._id || order.id} order={order} />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-16">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <p className="text-gray-600 text-xl">No orders found</p>
                <p className="text-gray-500 mt-2">Try changing the filter or check your connection</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
