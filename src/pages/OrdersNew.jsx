import React, { useState, useEffect } from "react";
import OrderCardNew from "../components/Orders/OrderCardNew.jsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/Index.js";
import { enqueueSnackbar } from "notistack";

const OrdersNew = () => {
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Orders"
  }, [])

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  })

  if(isError) {
    console.error("Orders fetch error:", isError);
    enqueueSnackbar("Something went wrong!", {variant: "error"})
  }

  // ✅ Debug logging
  console.log("OrdersNew - Full API Response:", resData);
  console.log("OrdersNew - Response data:", resData?.data);
  console.log("OrdersNew - Response data.data:", resData?.data?.data);
  console.log("OrdersNew - Response orders:", resData?.orders);
  console.log("OrdersNew - Response structure keys:", Object.keys(resData || {}));
  if (resData?.data) {
    console.log("OrdersNew - Response data keys:", Object.keys(resData.data));
  }

  // ✅ Safe data extraction with improved logic
  let orders = [];
  if (resData?.data?.orders && Array.isArray(resData.data.orders)) {
    orders = resData.data.orders;
  } else if (resData?.data?.data && Array.isArray(resData.data.data)) {
    orders = resData.data.data;
  } else if (resData?.orders && Array.isArray(resData.orders)) {
    orders = resData.orders;
  } else if (resData?.data && Array.isArray(resData.data)) {
    orders = resData.data;
  } else if (Array.isArray(resData)) {
    orders = resData;
  }

  console.log("OrdersNew - Final extracted orders:", orders);
  console.log("OrdersNew - Orders count:", orders.length);

  // Filter orders based on status
  const filteredOrders = status === "all"
    ? orders
    : orders.filter(order => order.orderStatus?.toLowerCase() === status.toLowerCase());

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
            In Progress ({orders.filter(o => o.orderStatus?.toLowerCase() === "in progress").length})
          </button>
          <button
            onClick={() => setStatus("ready")}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
              status === "ready"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Ready ({orders.filter(o => o.orderStatus?.toLowerCase() === "ready").length})
          </button>
          <button
            onClick={() => setStatus("completed")}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
              status === "completed"
                ? "bg-gray-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Completed ({orders.filter(o => o.orderStatus?.toLowerCase() === "completed").length})
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
              <OrderCardNew key={order._id || order.id} order={order} />
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

export default OrdersNew;
