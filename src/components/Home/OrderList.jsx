import React from "react";
import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { getAvatarName } from "../../utils/index";

const OrderList = ({ key, order }) => {
  return (
    <div className="flex items-center gap-2 mb-1">
      <button className="bg-blue-500 p-1 text-sm font-bold rounded-lg">
        {getAvatarName(order.customerDetails.name)}
      </button>
      <div className="flex items-center justify-between w-100\%">
        <div className="flex flex-col items-start gap-0.5">
          <h1 className="text-f5f5f5 text-sm font-semibold tracking-wide">
            {order.customerDetails.name}
          </h1>
          <p className="text-ababab text-xs">{order.items.length} Items</p>
        </div>

        <h1 className="text-blue-400 font-semibold border border-blue-400 rounded-lg p-0.5 text-xs">
          Table <FaLongArrowAltRight className="text-ababab ml-0.5 inline" />{" "}
          {order.table.tableNo}
        </h1>

        <div className="flex flex-col items-end gap-0.5">
          {order.orderStatus === "Ready" ? (
            <>
              <p className="text-green-400 bg-green-900 px-1 py-0.5 rounded-lg text-xs">
                <FaCheckDouble className="inline mr-0.5" /> {order.orderStatus}
              </p>
            </>
          ) : (
            <>
              <p className="text-yellow-400 bg-yellow-900 px-1 py-0.5 rounded-lg text-xs">
                <FaCircle className="inline mr-0.5" /> {order.orderStatus}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;