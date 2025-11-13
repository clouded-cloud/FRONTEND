import React, { useState, useEffect } from "react";
import OrderCardNew from "../components/Orders/OrderCardNew.jsx";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders, getWebsiteOrders } from "../https/Index.js";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { selectAllOrders } from "../redux/slices/orderSlice";

const OrdersNew = () => {
  const [status, setStatus] = useState("all");
  const [showDebug, setShowDebug] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  const {
    data: resData,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    placeholderData: keepPreviousData,
    refetchInterval: 10000, // Every 10 seconds
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Fetch website orders separately
  const {
    data: websiteOrdersData,
    isError: websiteError,
    isFetching: websiteFetching,
  } = useQuery({
    queryKey: ["websiteOrders"],
    queryFn: async () => await getWebsiteOrders(),
    placeholderData: keepPreviousData,
    refetchInterval: 10000, // Every 10 seconds
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Error handling
  useEffect(() => {
    if (isError) {
      console.error("Orders fetch error:", isError);
      enqueueSnackbar("Failed to load orders", { variant: "error" });
    }
  }, [isError]);

  // Log website orders fetch results for debugging
  useEffect(() => {
    if (websiteError) {
      console.error("Website orders fetch error:", websiteError);
      enqueueSnackbar("Failed to load website orders (see console)", { variant: "warning" });
    }
  }, [websiteError]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug("websiteOrdersData raw:", websiteOrdersData);
  }, [websiteOrdersData]);

  // ──────────────────────────────────────────────────────────────
  // 1. Safe & Robust Data Extraction
  // ──────────────────────────────────────────────────────────────
  
  // Try to find the first array of objects anywhere inside the response
  const findFirstArray = (obj, depth = 0) => {
    if (!obj || depth > 4) return null;
    if (Array.isArray(obj) && obj.length > 0) return obj;
    if (typeof obj !== "object") return null;
    for (const key of Object.keys(obj)) {
      try {
        const candidate = obj[key];
        if (Array.isArray(candidate) && candidate.length > 0) return candidate;
        if (typeof candidate === "object") {
          const found = findFirstArray(candidate, depth + 1);
          if (found) return found;
        }
      } catch (e) {
        // ignore
      }
    }
    return null;
  };

  const extractOrders = (data) => {
    if (!data) return [];
    // Common explicit paths first
    const candidates = [
      data?.data?.orders,
      data?.data?.data,
      data?.orders,
      data?.data,
      data,
    ];
    for (const candidate of candidates) {
      if (Array.isArray(candidate) && candidate.length > 0) return candidate;
    }
    // Fallback: recursively search for first array
    const found = findFirstArray(data);
    return Array.isArray(found) ? found : [];
  };

  const orders = extractOrders(resData);

  // Extract website orders
  const websiteOrders = extractOrders(websiteOrdersData);

  // Merge with local Redux orders (orders created via CartSidebar)
  const localOrders = useSelector((state) => selectAllOrders(state) || []);

  const mergeOrders = (() => {
    const map = new Map();
    const getId = (o) => o._id || o.id || o.orderId || JSON.stringify(o.items || []);
    // Add local first so server can override if same id
    (localOrders || []).forEach((o) => map.set(getId(o), o));
    (orders || []).forEach((o) => {
      const id = getId(o);
      if (!map.has(id)) map.set(id, o);
    });
    // Add website orders
    (websiteOrders || []).forEach((o) => {
      const id = getId(o);
      if (!map.has(id)) map.set(id, o);
    });
    return Array.from(map.values());
  })();

  console.log("Final Orders Count (merged):", mergeOrders.length);
  console.log("  - Local Redux orders:", localOrders?.length || 0);
  console.log("  - Server orders:", orders?.length || 0);
  console.log("  - Website orders:", websiteOrders?.length || 0);


  // ──────────────────────────────────────────────────────────────
  // 2. Filter Logic + Count Helpers
  // ──────────────────────────────────────────────────────────────
  const normalizeStatus = (o) => {
    return (
      o?.status || o?.orderStatus || o?.paymentStatus || "pending"
    ).toString().toLowerCase();
  };

  const getStatusCount = (targetStatus) => {
    if (targetStatus === "all") return mergeOrders.length;
    return mergeOrders.filter((o) => normalizeStatus(o) === targetStatus.toLowerCase()).length;
  };

  const filteredOrders =
    status === "all"
      ? mergeOrders
      : mergeOrders.filter(
          (o) => o?.orderStatus?.toLowerCase() === status.toLowerCase()
        );

  // ──────────────────────────────────────────────────────────────
  // 3. Render
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Management
            </h1>
            <p className="text-gray-600">View and manage all customer orders</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {isFetching ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Updating...
              </>
            ) : (
              "Refresh"
            )}
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          {["all", "in progress", "ready", "completed"].map((s) => {
            const count = getStatusCount(s);
            const isActive = status === s;

            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
                  isActive
                    ? s === "all"
                      ? "bg-blue-600 text-white shadow-lg"
                      : s === "in progress"
                      ? "bg-yellow-600 text-white shadow-lg"
                      : s === "ready"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-gray-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1).replace(" progress", " Progress")} ({count})
              </button>
            );
          })}
        </div>

        <div className="mb-4 flex items-center justify-end gap-3">
          <button
            onClick={() => setShowDebug((s) => !s)}
            className="px-3 py-1 bg-gray-100 rounded text-sm"
          >
            {showDebug ? "Hide debug" : "Show debug"}
          </button>
        </div>

        {showDebug && (
          <div className="mb-6 p-4 bg-white rounded border">
            <h4 className="font-semibold mb-2">Debug: Raw API Responses</h4>
            <div className="text-xs text-gray-700 mb-2">
              <div className="font-medium">Server orders (resData):</div>
              <pre className="max-h-40 overflow-auto bg-gray-50 p-2">{JSON.stringify(resData, null, 2)}</pre>
            </div>
            <div className="text-xs text-gray-700">
              <div className="font-medium">Website orders (websiteOrdersData):</div>
              <pre className="max-h-40 overflow-auto bg-gray-50 p-2">{JSON.stringify(websiteOrdersData, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading orders...</p>
              </div>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCardNew
                key={order._id || order.id || Math.random()}
                order={order}
              />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-16">
              <div className="text-center">
                <div className="text-6xl mb-4">Clipboard</div>
                <p className="text-gray-600 text-xl">No orders found</p>
                <p className="text-gray-500 mt-2">
                  {status === "all"
                    ? "No orders yet. Start taking orders!"
                    : `No ${status} orders.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersNew;
