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
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
  });

  const {
    data: websiteOrdersData,
    isError: websiteError,
    isFetching: websiteFetching,
  } = useQuery({
    queryKey: ["websiteOrders"],
    queryFn: async () => await getWebsiteOrders(),
    placeholderData: keepPreviousData,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (isError) {
      console.error("Orders fetch error:", isError);
      enqueueSnackbar("Failed to load orders", { variant: "error" });
    }
  }, [isError]);

  useEffect(() => {
    if (websiteError) {
      console.error("Website orders fetch error:", websiteError);
      enqueueSnackbar("Failed to load website orders (see console)", { variant: "warning" });
    }
  }, [websiteError]);

  useEffect(() => {
    console.debug("websiteOrdersData raw:", websiteOrdersData);
  }, [websiteOrdersData]);

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
    const found = findFirstArray(data);
    return Array.isArray(found) ? found : [];
  };

  const orders = extractOrders(resData);
  const websiteOrders = extractOrders(websiteOrdersData);
  const localOrders = useSelector((state) => selectAllOrders(state) || []);

  const mergeOrders = (() => {
    const map = new Map();
    const getId = (o) => o._id || o.id || o.orderId || JSON.stringify(o.items || []);
    (localOrders || []).forEach((o) => map.set(getId(o), o));
    (orders || []).forEach((o) => {
      const id = getId(o);
      if (!map.has(id)) map.set(id, o);
    });
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

  const normalizeStatus = (o) => {
    const raw = (o?.status || o?.orderStatus || o?.paymentStatus || "pending").toString().toLowerCase();
    // Map common backend/app synonyms to the UI categories
    if (raw === "pending" || raw === "processing" || raw === "inprogress" || raw === "in progress") return "in progress";
    if (raw === "done" || raw === "completed" || raw === "complete") return "completed";
    if (raw === "ready" || raw === "ready for pickup") return "ready";
    return raw; // default – whatever the backend returned
  }; // REMOVED THE EXTRA CLOSING BRACE THAT WAS HERE

  const getStatusCount = (targetStatus) => {
    if (targetStatus === "all") return mergeOrders.length;
    return mergeOrders.filter((o) => normalizeStatus(o) === targetStatus.toLowerCase()).length;
  };

  const filteredOrders =
    status === "all"
      ? mergeOrders
      : mergeOrders.filter((o) => normalizeStatus(o) === status.toLowerCase());

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Header */}
        <div className="orders-header">
          <div>
            <h1 className="orders-title">
              Order Management
            </h1>
            <p className="orders-subtitle">View and manage all customer orders</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="refresh-btn"
          >
            {isFetching ? (
              <>
                <div className="refresh-spinner"></div>
                Updating...
              </>
            ) : (
              "Refresh"
            )}
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {["all", "in progress", "ready", "completed"].map((s) => {
            const count = getStatusCount(s);
            const isActive = status === s;

            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`filter-btn ${isActive ? 'filter-btn-active' : 'filter-btn-inactive'} ${
                  isActive ? `filter-${s.replace(' ', '-')}` : ''
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1).replace(" progress", " Progress")} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders Grid */}
        <div className="orders-grid">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCardNew
                key={order._id || order.id || Math.random()}
                order={order}
              />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p className="empty-title">No orders found</p>
              <p className="empty-subtitle">
                {status === "all"
                  ? "No orders yet. Start taking orders!"
                  : `No ${status} orders.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersNew; // FIXED THE EXPORT STATEMENT