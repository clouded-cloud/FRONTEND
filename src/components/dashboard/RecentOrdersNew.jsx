import React from "react";
import { GrUpdate } from "react-icons/gr";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../https/Index.js";
import { formatDateAndTime } from "../../utils/index.js";

const RecentOrdersNew = () => {
  const queryClient = useQueryClient();
  
  const handleStatusChange = ({orderId, orderStatus}) => {
    console.log(orderId)
    orderStatusUpdateMutation.mutate({orderId, orderStatus});
  };

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({orderId, orderStatus}) => updateOrderStatus({orderId, orderStatus}),
    onSuccess: (data) => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    }
  })

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    console.error("RecentOrdersNew fetch error:", isError);
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  console.log("RecentOrdersNew - Full API Response:", resData);
  console.log("RecentOrdersNew - Response data:", resData?.data);
  console.log("RecentOrdersNew - Response data.data:", resData?.data?.data);
  console.log("RecentOrdersNew - Response orders:", resData?.orders);

  const orders = resData?.data?.orders ||
                resData?.data?.data ||
                resData?.orders ||
                resData?.data ||
                [];

  console.log("RecentOrdersNew - Extracted orders:", orders);

  return (
    <div className="recent-orders-container">
      <div className="recent-orders-card">
        <div className="recent-orders-header">
          <h2 className="recent-orders-title">
            Recent Orders
          </h2>
          <div className="recent-orders-stats">
            {orders.length} orders
          </div>
        </div>
        
        <div className="table-container">
          <table className="orders-table">
            <thead className="table-header">
              <tr>
                <th className="table-th">Order ID</th>
                <th className="table-th">Customer</th>
                <th className="table-th">Status</th>
                <th className="table-th">Date & Time</th>
                <th className="table-th">Items</th>
                <th className="table-th">Table No</th>
                <th className="table-th">Total</th>
                <th className="table-th text-center">Payment Method</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="loading-cell">
                    <div className="loading-content">
                      <div className="table-spinner"></div>
                      <span>Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr
                    key={order._id || index}
                    className="table-row"
                  >
                    <td className="table-td">
                      <span className="order-id">
                        #{order._id?.slice(-6) || Math.floor(new Date(order.orderDate).getTime()).toString().slice(-6)}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="customer-info">
                        <span className="customer-name">
                          {order.customerDetails?.name || (order.customerDetails?.phone ? `Customer ${order.customerDetails.phone}` : "Unknown Customer")}
                        </span>
                      </div>
                    </td>
                    <td className="table-td">
                      <select
                        className={`status-select ${
                          order.orderStatus === "Ready" ? "status-ready" : "status-in-progress"
                        }`}
                        value={order.orderStatus || "In Progress"}
                        onChange={(e) => handleStatusChange({orderId: order._id, orderStatus: e.target.value})}
                      >
                        <option value="In Progress" className="status-option-in-progress">
                          In Progress
                        </option>
                        <option value="Ready" className="status-option-ready">
                          Ready
                        </option>
                      </select>
                    </td>
                    <td className="table-td">
                      <span className="datetime">
                        {formatDateAndTime(order.orderDate)}
                      </span>
                    </td>
                    <td className="table-td">
                      <span className="items-count">
                        {order.items?.length || 0} Items
                      </span>
                    </td>
                    <td className="table-td">
                      <span className="table-number">
                        {order.table?.tableNo ? `Table ${order.table.tableNo}` : "N/A"}
                      </span>
                    </td>
                    <td className="table-td">
                      <span className="total-amount">
                        KSH {order.bills?.totalWithTax || 0}
                      </span>
                    </td>
                    <td className="table-td text-center">
                      <span className={`payment-method ${order.paymentMethod?.toLowerCase() || 'cash'}`}>
                        {order.paymentMethod || "Cash"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    <div className="empty-content">
                      <div className="empty-icon">📋</div>
                      <span>No orders found</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .recent-orders-container {
          padding: 1.5rem;
          font-family: 'Inter', sans-serif;
        }

        .recent-orders-card {
          background: white;
          border-radius: 20px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .recent-orders-header {
          padding: 2rem 2rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
        }

        .recent-orders-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .recent-orders-stats {
          padding: 0.5rem 1rem;
          background: #f8f9ff;
          color: var(--primary);
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .table-container {
          overflow-x: auto;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-header {
          background: #f8f9ff;
        }

        .table-th {
          padding: 1rem 1.5rem;
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--border-color);
        }

        .table-body {
          background: white;
        }

        .table-row {
          border-bottom: 1px solid var(--border-color);
          transition: all 0.2s ease;
        }

        .table-row:hover {
          background: #f8f9ff;
        }

        .table-td {
          padding: 1.25rem 1.5rem;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .loading-cell, .empty-cell {
          padding: 3rem 1.5rem;
          text-align: center;
        }

        .loading-content, .empty-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-secondary);
        }

        .table-spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid var(--border-color);
          border-top: 2px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .empty-icon {
          font-size: 2rem;
          opacity: 0.5;
        }

        /* Order ID */
        .order-id {
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        /* Customer Info */
        .customer-info {
          display: flex;
          flex-direction: column;
        }

        .customer-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        /* Status Select */
        .status-select {
          padding: 0.5rem 0.75rem;
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
          min-width: 120px;
        }

        .status-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
        }

        .status-in-progress {
          color: #eab308;
          border-color: #fef08a;
          background: #fefce8;
        }

        .status-ready {
          color: #16a34a;
          border-color: #bbf7d0;
          background: #f0fdf4;
        }

        .status-option-in-progress {
          color: #eab308;
          background: white;
        }

        .status-option-ready {
          color: #16a34a;
          background: white;
        }

        /* Date & Time */
        .datetime {
          font-size: 0.875rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        /* Items Count */
        .items-count {
          padding: 0.25rem 0.75rem;
          background: #f8f9ff;
          color: var(--primary);
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Table Number */
        .table-number {
          padding: 0.25rem 0.75rem;
          background: #f0fdf4;
          color: #16a34a;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Total Amount */
        .total-amount {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 1rem;
        }

        /* Payment Method */
        .payment-method {
          padding: 0.375rem 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .payment-method.cash {
          background: #f0fdf4;
          color: #16a34a;
        }

        .payment-method.card {
          background: #fefce8;
          color: #eab308;
        }

        .payment-method.digital {
          background: #eff6ff;
          color: var(--primary);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .recent-orders-header {
            padding: 1.5rem 1.5rem 1rem;
          }
          
          .table-th, .table-td {
            padding: 1rem;
          }
        }

        @media (max-width: 768px) {
          .recent-orders-container {
            padding: 1rem;
          }
          
          .recent-orders-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .table-th, .table-td {
            padding: 0.75rem 0.5rem;
            font-size: 0.8rem;
          }
          
          .status-select {
            min-width: 100px;
            font-size: 0.8rem;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RecentOrdersNew;