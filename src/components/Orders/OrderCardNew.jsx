import React from "react";

const OrderCardNew = ({ order }) => {
  // Handle both backend order data and sample data structures
  const customerName = order.customer || order.customerDetails?.name || order.customerName || "Customer";
  const tableNumber = order.tableNo || order.table?.tableNo || "N/A";
  const orderId = order._id || order.id || "N/A";
  const status = order.status || order.orderStatus || "Pending";
  const total = order.total || order.bills?.totalWithTax || 0;
  const itemsCount = order.items?.length || 0;
  const orderDate = order.createdAt || order.dateTime;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order #{orderId}
          </h3>
          <p className="text-sm text-gray-600">
            {customerName}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          status?.toLowerCase() === "completed"
            ? "bg-green-100 text-green-800"
            : status?.toLowerCase() === "ready"
            ? "bg-blue-100 text-blue-800"
            : status?.toLowerCase() === "in progress"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Table:</span> {tableNumber}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Items:</span> {itemsCount}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Total:</span> KSH{total}
        </p>
      </div>

      <div className="text-xs text-gray-500">
        {orderDate ? new Date(orderDate).toLocaleString() : "Date N/A"}
      </div>
    </div>
  );
};

export default OrderCardNew;
