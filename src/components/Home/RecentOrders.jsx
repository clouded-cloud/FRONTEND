import React from "react";
import { FaSearch } from "react-icons/fa";
import OrderList from "./OrderList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https/Index.js";

const RecentOrders = () => {
  const { data: resData, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    console.error("Error fetching orders:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config,
    });
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  // Safe extraction of orders data
  const orders = resData?.data?.data || [];

  return (
    <div className="px-2 mt-2">
      <div className="bg-1a1a1a w-full h-200px rounded-lg border border-gray-700">
        <div className="flex justify-between items-center px-2 py-1">
          <h1 className="text-f5f5f5 text-sm font-semibold tracking-wide">
            Recent Orders
          </h1>
          <a href="" className="text-blue-400 text-xs font-semibold">
            View all
          </a>
        </div>

        <div className="flex items-center gap-1 bg-1f1f1f rounded-8px px-2 py-1 mx-2">
          <FaSearch className="text-f5f5f5" />
          <input
            type="text"
            placeholder="Search recent orders"
            className="bg-1f1f1f focus:outline-none text-f5f5f5 w-full text-xs"
          />
        </div>

        {/* Order list */}
        <div className="mt-1 px-2 overflow-y-auto h-120px scrollbar-hide">
          {orders.length > 0 ? (
            orders.map((order) => {
              return <OrderList key={order._id} order={order} />;
            })
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">No orders available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;