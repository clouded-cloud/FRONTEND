import React, { useState, useMemo } from "react";
import { FaSearch, FaSync } from "react-icons/fa";
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
    <div className="recent-orders-container">
      <div className="recent-orders-card">
        {/* Header */}
        <div className="orders-header">
          <div className="header-content">
            <h1 className="orders-title">
              Recent Orders 
              {isFetching && (
                <span className="updating-indicator">
                  <div className="spinner"></div>
                  Updating...
                </span>
              )}
            </h1>
            <button
              onClick={() => refetch()}
              className="refresh-button"
              disabled={isFetching}
            >
              <FaSync className={`refresh-icon ${isFetching ? 'spinning' : ''}`} />
              {isFetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search orders by customer, table, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Order List */}
        <div className="orders-list-container">
          {filteredOrders.length > 0 ? (
            <div className="orders-grid">
              {filteredOrders.map((order) => (
                <OrderListNew
                  key={order._id || order.id || Math.random()}
                  order={order}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p className="empty-text">
                {searchTerm ? "No matching orders found" : "No orders available"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="clear-search-button"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .recent-orders-container {
          padding: 1rem;
          font-family: 'Inter', sans-serif;
        }

        .recent-orders-card {
          background: var(--card-bg);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .recent-orders-card:hover {
          box-shadow: var(--shadow-lg);
        }

        .orders-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          background: #f8f9fa;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .orders-title {
          color: var(--text-primary);
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .updating-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid var(--border-color);
          border-top: 2px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-button:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(44, 85, 48, 0.3);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .refresh-icon {
          font-size: 0.875rem;
          transition: transform 0.3s ease;
        }

        .refresh-icon.spinning {
          animation: spin 1s linear infinite;
        }

        .search-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--input-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          padding: 0.875rem 1rem;
          margin: 1.25rem 1.5rem;
          transition: all 0.2s ease;
        }

        .search-container:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        .search-icon {
          color: var(--text-muted);
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .search-input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 0.95rem;
          width: 100%;
          font-family: 'Inter', sans-serif;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .orders-list-container {
          max-height: 400px;
          overflow-y: auto;
          padding: 0 1.5rem 1.5rem;
        }

        .orders-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          text-align: center;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-text {
          color: var(--text-secondary);
          font-size: 1rem;
          margin: 0 0 1.5rem 0;
          font-weight: 500;
        }

        .clear-search-button {
          padding: 0.75rem 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-search-button:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(44, 85, 48, 0.3);
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Custom scrollbar */
        .orders-list-container::-webkit-scrollbar {
          width: 6px;
        }

        .orders-list-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .orders-list-container::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }

        .orders-list-container::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        /* Order item animations */
        .orders-grid > * {
          animation: slideInUp 0.4s ease-out;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Stagger animation for orders */
        .orders-grid > *:nth-child(1) { animation-delay: 0.1s; }
        .orders-grid > *:nth-child(2) { animation-delay: 0.2s; }
        .orders-grid > *:nth-child(3) { animation-delay: 0.3s; }
        .orders-grid > *:nth-child(4) { animation-delay: 0.4s; }
        .orders-grid > *:nth-child(5) { animation-delay: 0.5s; }

        /* Responsive Design */
        @media (max-width: 768px) {
          .recent-orders-container {
            padding: 0.75rem;
          }

          .orders-header {
            padding: 1rem 1.25rem;
          }

          .orders-title {
            font-size: 1.125rem;
          }

          .search-container {
            margin: 1rem 1.25rem;
            padding: 0.75rem 1rem;
          }

          .orders-list-container {
            padding: 0 1.25rem 1.25rem;
            max-height: 350px;
          }

          .empty-state {
            padding: 2rem 1.25rem;
          }

          .empty-icon {
            font-size: 2.5rem;
          }

          .empty-text {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .recent-orders-container {
            padding: 0.5rem;
          }

          .recent-orders-card {
            border-radius: 12px;
          }

          .orders-header {
            padding: 0.875rem 1rem;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .orders-title {
            font-size: 1rem;
          }

          .refresh-button {
            align-self: stretch;
            justify-content: center;
          }

          .search-container {
            margin: 0.875rem 1rem;
          }

          .orders-list-container {
            padding: 0 1rem 1rem;
            max-height: 300px;
          }

          .empty-state {
            padding: 1.5rem 1rem;
          }

          .empty-icon {
            font-size: 2rem;
          }
        }

        /* Loading state enhancement */
        .refresh-button:disabled .refresh-icon {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RecentOrders;