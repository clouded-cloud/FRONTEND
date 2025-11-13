import React, { useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import OrderListNew from "./OrderListItem.jsx";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https/Index.js";
import { orders as hardcodedOrders } from "../../Constants/Index.js";

const RecentOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const {
    data: resData,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60, // 1 minute
  });

  // Handle API errors
  React.useEffect(() => {
    if (isError) {
      console.error("RecentOrders fetch error:", error);
      if (error?.response?.status !== 404) {
        enqueueSnackbar("Failed to load orders", { variant: "error" });
      }
    }
  }, [isError, error]);

  // Debug (remove in production)
  console.log("API Response:", resData);

  // Extract orders safely
  const apiOrders =
    resData?.data?.data ||
    resData?.data?.orders ||
    resData?.orders ||
    resData?.data ||
    [];

  const rawOrders = Array.isArray(apiOrders) && apiOrders.length > 0
    ? apiOrders
    : hardcodedOrders;

  // Filter by search
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return rawOrders;

    const term = searchTerm.toLowerCase();
    return rawOrders.filter((order) => {
      const customerName =
        (
          order.customer ||
          order.customerDetails?.name ||
          order.customerName ||
          ""
        ).toLowerCase();

      const tableNo = (order.tableNo || order.table?.tableNo || "").toString();

      return (
        customerName.includes(term) ||
        tableNo.includes(term) ||
        order._id?.includes(term) ||
        order.id?.includes(term)
      );
    });
  }, [rawOrders, searchTerm]);

  return (
    <div className="px-2 mt-2">
      <div className="bg-[#1a1a1a] w-full rounded-lg border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-3 py-2 border-b border-gray-700">
          <h1 className="text-[#f5f5f5] text-sm font-semibold tracking-wide">
            Recent Orders {isFetching && "(Updating...)"}
          </h1>
          <button
            onClick={() => refetch()}
            className="text-blue-400 text-xs font-semibold hover:underline transition"
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-[#1f1f1f] rounded-lg pxappearing-3 py-2 mx-3 my-2">
          <FaSearch className="text-[#f5f5f5] text-sm" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none text-[#f5f5f5] w-full text-xs placeholder-gray-500"
          />
        </div>

        {/* Order List */}
        <div className="max-h-32 overflow-y-auto px-3 scrollbar-hide">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderListNew
                key={order._id || order.id || Math.random()}
                order={order}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-20">
              <p className="text-gray-500 text-xs">
                {searchTerm ? "No matching orders" : "No orders available"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Hide */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RecentOrders;
