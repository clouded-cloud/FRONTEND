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
      queryClient.invalidateQueries(["orders"]); // Refresh order list
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

  // ✅ Debug logging
  console.log("RecentOrdersNew - Full API Response:", resData);
  console.log("RecentOrdersNew - Response data:", resData?.data);
  console.log("RecentOrdersNew - Response data.data:", resData?.data?.data);
  console.log("RecentOrdersNew - Response orders:", resData?.orders);

  // ✅ Safe data extraction
  const orders = resData?.data?.orders ||
                resData?.data?.data ||
                resData?.orders ||
                resData?.data ||
                [];

  console.log("RecentOrdersNew - Extracted orders:", orders);

  return (
    <div className="container mx-auto bg-[262626] p-4 rounded-lg">
      <h2 className="text-f5f5f5 text-xl font-semibold mb-4">
        Recent Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-f5f5f5">
          <thead className="bg-[#333] text-ababab">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Items</th>
              <th className="p-3">Table No</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="p-4 text-center">Loading...</td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order, index) => (
                <tr
                  key={order._id || index}
                  className="border-b border-gray-600 hover:bg-[#333]"
                >
                  <td className="p-4">#{order._id || Math.floor(new Date(order.orderDate).getTime())}</td>
                  <td className="p-4">{order.customerDetails?.name || (order.customerDetails?.phone ? `Customer ${order.customerDetails.phone}` : "Unknown Customer")}</td>
                  <td className="p-4">
                    <select
                      className={`bg-[#1a1a1a] text-f5f5f5 border border-gray-500 p-2 rounded-lg focus:outline-none ${
                        order.orderStatus === "Ready"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                      value={order.orderStatus || "In Progress"}
                      onChange={(e) => handleStatusChange({orderId: order._id, orderStatus: e.target.value})}
                    >
                      <option className="text-yellow-500" value="In Progress">
                        In Progress
                      </option>
                      <option className="text-green-500" value="Ready">
                        Ready
                      </option>
                    </select>
                  </td>
                  <td className="p-4">{formatDateAndTime(order.orderDate)}</td>
                  <td className="p-4">{order.items?.length || 0} Items</td>
                  <td className="p-4">Table - {order.table?.tableNo || "N/A"}</td>
                  <td className="p-4">KSH{order.bills?.totalWithTax || 0}</td>
                  <td className="p-4">
                    {order.paymentMethod || "Cash"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersNew;
