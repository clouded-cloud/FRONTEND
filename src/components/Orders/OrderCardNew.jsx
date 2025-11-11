import React from "react";

const OrderCardNew = ({ order }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order #{order._id || order.id}
          </h3>
          <p className="text-sm text-gray-600">
            {order.customerName || order.customer?.name || "Customer"}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          order.orderStatus?.toLowerCase() === "completed"
            ? "bg-green-100 text-green-800"
            : order.orderStatus?.toLowerCase() === "ready"
            ? "bg-blue-100 text-blue-800"
            : order.orderStatus?.toLowerCase() === "in progress"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {order.orderStatus || "Pending"}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Table:</span> {order.tableNumber || order.table?.number || "N/A"}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Items:</span> {order.items?.length || 0}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Total:</span> ${order.totalPrice || order.total || 0}
        </p>
      </div>

      <div className="text-xs text-gray-500">
        {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Date N/A"}
      </div>
    </div>
  );
};

export default OrderCardNew;
