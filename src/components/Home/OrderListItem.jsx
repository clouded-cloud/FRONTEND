import React from "react";

const OrderListNew = ({ order }) => {
  // ──────────────────────────────────────────────────────────────
  // 1. Normalise all possible data shapes
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

  // Items – support multiple shapes
  const items = Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.orderItems)
    ? order.orderItems
    : Array.isArray(order.cartItems)
    ? order.cartItems
    : [];

  // ──────────────────────────────────────────────────────────────
  // 2. Build WhatsApp message (URL-encoded)
  // ──────────────────────────────────────────────────────────────
  const sendToWhatsApp = () => {
    if (!items.length) {
      alert("No items in order!");
      return;
    }

    const businessPhone = "254712345678"; // ← CHANGE TO YOUR WHATSAPP BUSINESS NUMBER

    let message = `*New Order*%0A%0A`;
    message += `*Customer:* ${customerName}%0A`;
    if (customerPhone) message += `*Phone:* ${customerPhone}%0A`;
    message += `*Table:* ${tableNumber}%0A%0A`;

    items.forEach((it, i) => {
      const name = it.name || it.itemName || "Item";
      const qty = it.qty || it.quantity || 1;
      const price = it.price || it.unitPrice || 0;
      const lineTotal = (price * qty).toFixed(2);
      message += `${i + 1}. ${name} × ${qty} = KSH${lineTotal}%0A`;
    });

    message += `%0A*Total:* KSH${total.toFixed(2)}%0A`;
    message += `*Status:* ${status}`;

    const waURL = `https://wa.me/${businessPhone}?text=${message}`;
    window.open(waURL, "_blank");
  };

  // ──────────────────────────────────────────────────────────────
  // 3. Render
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col py-3 px-2 border-b border-gray-600 last:border-b-0">
      {/* Header: Name + Table */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-f5f5f5 text-sm font-medium">{customerName}</p>
            <p className="text-gray-400 text-xs">Table {tableNumber}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-f5f5f5 text-sm font-medium">KSH{total.toFixed(2)}</p>
          <p className="text-gray-400 text-xs">{status}</p>
        </div>
      </div>

      {/* Items List (collapsible-style) */}
      {items.length > 0 && (
        <div className="ml-11 text-xs text-gray-300 space-y-1 mb-2">
          {items.map((it, i) => {
            const name = it.name || it.itemName || "Item";
            const qty = it.qty || it.quantity || 1;
            return (
              <div key={i} className="flex justify-between">
                <span>
                  {name} × {qty}
                </span>
                <span>KSH{(it.price * qty).toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={sendToWhatsApp}
        className="mt-2 w-full py-1.5 bg-green-600 text-white text-xs rounded font-medium hover:bg-green-700 transition"
      >
        Send to WhatsApp
      </button>
    </div>
  );
};

export default OrderListNew;
