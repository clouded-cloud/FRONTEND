import React from "react";

import { useState } from "react";

const OrderCardNew = ({ order }) => {
  // ──────────────────────────────────────────────────────────────
  // 1. Normalize all possible data shapes
  // ──────────────────────────────────────────────────────────────
  const customerName =
    order.customer ||
    order.customerDetails?.name ||
    order.customerName ||
    order.customer?.name ||
    "Customer";

  const customerPhone =
    order.customerPhone ||
    order.customerDetails?.phone ||
    order.customer?.phone ||
    "";

  const tableNumber =
    order.tableNo ||
    order.table?.tableNo ||
    order.tableNumber ||
    "N/A";

  const orderId = order._id || order.id || "N/A";

  const status =
    order.status ||
    order.orderStatus ||
    order.paymentStatus ||
    "Pending";

  const total =
    order.total ||
    order.bills?.totalWithTax ||
    order.grandTotal ||
    0;

  const items = Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.orderItems)
    ? order.orderItems
    : [];

  const itemsCount = items.length;

  const orderDate = order.createdAt || order.dateTime || order.timestamp;

  // ──────────────────────────────────────────────────────────────
  // 2. WhatsApp Message Builder
  // ──────────────────────────────────────────────────────────────
  const sendToWhatsApp = () => {
    if (itemsCount === 0) {
      alert("No items in this order!");
      return;
    }

    const businessPhone = "254712345678"; // ← CHANGE TO YOUR WHATSAPP NUMBER

    let message = `*Order #${orderId}*%0A%0A`;
    message += `*Customer:* ${customerName}%0A`;
    if (customerPhone) message += `*Phone:* ${customerPhone}%0A`;
    message += `*Table:* ${tableNumber}%0A%0A`;

    items.forEach((item, i) => {
      const name = item.name || item.itemName || "Item";
      const qty = item.qty || item.quantity || 1;
      const price = item.price || item.unitPrice || 0;
      const lineTotal = (price * qty).toFixed(2);
      message += `${i + 1}. ${name} × ${qty} = KSH${lineTotal}%0A`;
    });

    message += `%0A*Total:* KSH${total.toFixed(2)}%0A`;
    message += `*Status:* ${status}%0A`;
    if (orderDate) {
      message += `*Time:* ${new Date(orderDate).toLocaleString()}`;
    }

    const waURL = `https://wa.me/${businessPhone}?text=${message}`;
    window.open(waURL, "_blank");
  };

  // ──────────────────────────────────────────────────────────────
  // 3. Status Badge Styling
  // ──────────────────────────────────────────────────────────────
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "completed") return "bg-green-100 text-green-800";
    if (s === "ready") return "bg-blue-100 text-blue-800";
    if (s === "in progress") return "bg-yellow-100 text-yellow-800";
    if (s === "cancelled") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  // ──────────────────────────────────────────────────────────────
  // 4. Render
  // ──────────────────────────────────────────────────────────────
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Order #{orderId}
          </h3>
          <p className="text-sm text-gray-600">{customerName}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
            status
          )}`}
        >
          {status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1 text-sm text-gray-600 mb-3">
        <p>
          <span className="font-medium">Table:</span> {tableNumber}
        </p>
        <p>
          <span className="font-medium">Items:</span> {itemsCount}
        </p>
        <p>
          <span className="font-medium">Total:</span>{" "}
          <span className="font-bold text-gray-900">
            KSH{total.toFixed(2)}
          </span>
        </p>
      </div>

      {/* Items list (collapsible) */}
      <div className="mb-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-sm text-blue-600 hover:underline mb-2"
        >
          {open ? "Hide items" : "Show items"}
        </button>
        {open && (
          <div className="space-y-2 text-sm">
            {items.map((it, idx) => {
              const name = it.name || it.itemName || "Item";
              const qty = it.qty || it.quantity || 1;
              const price = Number(it.price) || Number(it.unitPrice) || 0;
              return (
                <div key={it.id || idx} className="flex justify-between">
                  <div className="truncate mr-2">{name} × {qty}</div>
                  <div className="font-medium">KSH {(price * qty).toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Date */}
      <p className="text-xs text-gray-500 mb-3">
        {orderDate
          ? new Date(orderDate).toLocaleString()
          : "Date N/A"}
      </p>

      {/* WhatsApp Button */}
      <button
        onClick={sendToWhatsApp}
        className="w-full py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
        Send to WhatsApp
      </button>
    </div>
  );
};

export default OrderCardNew;
