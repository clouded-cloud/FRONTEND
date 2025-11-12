import React from "react";

const OrderListNew = ({ order }) => {
  // Handle both backend order data and sample data structures
  const customerName = order.customer || order.customerDetails?.name || order.customerName || "Customer";
  const tableNumber = order.tableNo || order.table?.tableNo || "N/A";
  const status = order.status || order.orderStatus || "Pending";
  const total = order.total || order.bills?.totalWithTax || 0;

  return (
    <div className="flex items-center justify-between py-2 px-1 border-b border-gray-600 last:border-b-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {customerName.charAt(0)}
        </div>
        <div>
          <p className="text-f5f5f5 text-xs font-medium">
            {customerName}
          </p>
          <p className="text-gray-400 text-xs">
            Table {tableNumber}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-f5f5f5 text-xs font-medium">
          KSH{total}
        </p>
        <p className="text-gray-400 text-xs">
          {status}
        </p>
      </div>
    </div>
  );
};

export default OrderListNew;
