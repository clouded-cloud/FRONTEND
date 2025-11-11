import React from "react";

const OrderListNew = ({ order }) => {
  return (
    <div className="flex items-center justify-between py-2 px-1 border-b border-gray-600 last:border-b-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {order.customerName?.charAt(0) || order.customer?.name?.charAt(0) || "C"}
        </div>
        <div>
          <p className="text-f5f5f5 text-xs font-medium">
            {order.customerName || order.customer?.name || "Customer"}
          </p>
          <p className="text-gray-400 text-xs">
            Table {order.tableNumber || order.table?.number || "N/A"}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-f5f5f5 text-xs font-medium">
          ${order.totalPrice || order.total || 0}
        </p>
        <p className="text-gray-400 text-xs">
          {order.orderStatus || "Pending"}
        </p>
      </div>
    </div>
  );
};

export default OrderListNew;
