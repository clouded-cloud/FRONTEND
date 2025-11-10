import React from "react";
import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { getAvatarName } from "../../utils/index";

const OrderListNew = ({ order }) => {
  // Handle both API and hardcoded order structures
  const isApiOrder = order.customerDetails && order.table && typeof order.table === 'object';

  const customerName = isApiOrder ? order.customerDetails?.name : order.customer;
  const itemsCount = isApiOrder ? (Array.isArray(order.items) ? order.items.length : 0) : order.items;
  const tableNumber = isApiOrder ? order.table?.tableNo : order.tableNo;
  const orderStatus = isApiOrder ? order.orderStatus : order.status;

  return (
    <div className="flex items-center gap-2 mb-1">
      <button className="bg-blue-500 p-1 text-sm font-bold rounded-lg">
        {getAvatarName(typeof customerName === 'string' ? customerName : "N/A")}
      </button>
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start gap-0.5">
          <h1 className="text-f5f5f5 text-sm font-semibold tracking-wide">
            {typeof customerName === 'string' ? customerName : "Unknown Customer"}
          </h1>
          <p className="text-ababab text-xs">{typeof itemsCount === 'number' ? itemsCount : 0} Items</p>
        </div>

        <h1 className="text-blue-400 font-semibold border border-blue-400 rounded-lg p-0.5 text-xs">
          Table <FaLongArrowAltRight className="text-ababab ml-0.5 inline" />{" "}
          {typeof tableNumber === 'string' || typeof tableNumber === 'number' ? tableNumber : "N/A"}
        </h1>

        <div className="flex flex-col items-end gap-0.5">
          {orderStatus === "Ready" ? (
            <p className="text-green-400 bg-green-900 px-1 py-0.5 rounded-lg text-xs">
              <FaCheckDouble className="inline mr-0.5" /> {orderStatus}
            </p>
          ) : (
            <p className="text-yellow-400 bg-yellow-900 px-1 py-0.5 rounded-lg text-xs">
              <FaCircle className="inline mr-0.5" /> {typeof orderStatus === 'string' ? orderStatus : "Pending"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderListNew;
