import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { menus as seedMenus } from "../../Constants/Index";

const OrderCardNew = ({ order }) => {
  // ──────────────────────────────────────────────────────────────
  // 1. Normalize all possible data shapes
  // ──────────────────────────────────────────────────────────────
  // Normalize customer fields: `order.customer` might be a string or an object
  let customerName = "Customer";
  let customerPhone = "";

  if (order.customer) {
    if (typeof order.customer === "string") {
      customerName = order.customer;
    } else if (typeof order.customer === "object") {
      customerName = order.customer.name || order.customer.customerName || customerName;
      customerPhone = order.customer.phone || order.customer.customerPhone || customerPhone;
    }
  }

  if (!customerName || customerName === "Customer") {
    customerName = order.customerDetails?.name || order.customerName || customerName;
  }

  if (!customerPhone) {
    customerPhone = order.customerPhone || order.customerDetails?.phone || customerPhone;
  }

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

  // Try many common shapes for order items
  const rawItemsCandidate =
    order.items ||
    order.orderItems ||
    order.order_items ||
    order.cart ||
    order.products ||
    order.itemsList ||
    [];

  // If the candidate is a number (some APIs store count in `items`), treat as empty array
  const rawItems = typeof rawItemsCandidate === "number" ? [] : rawItemsCandidate;

  // If it's an object map { id: item, ... }, convert to array
  const itemsArray = !Array.isArray(rawItems) && rawItems && typeof rawItems === "object"
    ? Object.values(rawItems)
    : rawItems;

  const items = Array.isArray(itemsArray) ? itemsArray : [];
  const itemsCount = items.length;

  // Attempt to resolve item name/price when the order item is only an id/reference
  const menusFromState = useSelector((state) => state.menu);

  const findMenuItem = (itemId) => {
    const menusToSearch = Array.isArray(menusFromState) && menusFromState.length > 0 ? menusFromState : seedMenus;
    for (const cat of menusToSearch) {
      if (!cat || !Array.isArray(cat.items)) continue;
      const found = cat.items.find((it) => String(it.id) === String(itemId) || it._id === itemId || it.id === itemId);
      if (found) return found;
    }
    return null;
  };

  const resolveItem = (it) => {
    // If it already has name & price, return as-is
    const name = (it && (it.name || it.itemName || it.productName || it.title)) || null;
    const price = (it && (it.price || it.unitPrice || it.amount || it.cost)) || null;
    if (name && (price !== undefined)) return { name, price };

    // If it's just an id/reference
    const possibleId = it.id || it.itemId || it.menuId || it;
    const found = findMenuItem(possibleId);
    if (found) return { name: found.name, price: found.price || found.unitPrice || 0 };

    // Fallback
    return { name: name || "Item", price: Number(price) || 0 };
  };

  // If order total is missing (0), compute from resolved items
  let computedTotal = 0;
  try {
    computedTotal = items.reduce((sum, it) => {
      const qty = it.qty || it.quantity || it.count || 1;
      const resolved = resolveItem(it);
      const price = Number(resolved.price) || 0;
      return sum + price * qty;
    }, 0);
  } catch (e) {
    // ignore
  }

  const displayedTotal = (total && Number(total) > 0) ? Number(total) : computedTotal;

  const orderDate = order.createdAt || order.dateTime || order.timestamp;

  // Debugging: if key fields are missing, print the order so we can inspect incoming shape
  // eslint-disable-next-line no-console
  if (customerName === "Customer" || tableNumber === "N/A" || itemsCount === 0 || displayedTotal === 0) {
    // eslint-disable-next-line no-console
    console.debug("OrderCardNew - suspicious order shape:", { orderId, customerName, customerPhone, tableNumber, itemsCount, displayedTotal, order });
  }

  // ──────────────────────────────────────────────────────────────
  // 2. WhatsApp Message Builder
  // ──────────────────────────────────────────────────────────────
  const sendToWhatsApp = () => {
    if (itemsCount === 0) {
      alert("No items in this order!");
      return;
    }

    const businessPhone = "254742462975"; // WhatsApp number (normalized)

    // Build a readable plain-text message then encode for URL
    let lines = [];
    lines.push(`Order #${orderId}`);
    lines.push(`Customer: ${customerName}` + (customerPhone ? ` ( ${customerPhone} )` : ""));
    lines.push(`Table: ${tableNumber}`);
    lines.push("-----------------------");

    items.forEach((item, i) => {
      const name = item.name || item.itemName || "Item";
      const qty = item.qty || item.quantity || 1;
      const price = Number(item.price) || Number(item.unitPrice) || 0;
      const lineTotal = (price * qty).toFixed(2);
      lines.push(`${i + 1}. ${name}`);
      lines.push(`   Qty: ${qty}  Unit: KSH ${price}  Line: KSH ${lineTotal}`);
      if (item.description) lines.push(`   Note: ${item.description}`);
    });

    lines.push("-----------------------");
    lines.push(`Total: KSH ${total.toFixed(2)}`);
    lines.push(`Status: ${status}`);
    if (orderDate) lines.push(`Time: ${new Date(orderDate).toLocaleString()}`);

    const plain = lines.join("\n");
    const waURL = `https://wa.me/${businessPhone}?text=${encodeURIComponent(plain)}`;
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
          {customerPhone && (
            <p className="text-sm text-gray-500">Phone: {customerPhone}</p>
          )}
          {order.customerDetails?.guests || order.guests ? (
            <p className="text-sm text-gray-500">Guests: {order.customerDetails?.guests || order.guests}</p>
          ) : null}
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
              const qty = it.qty || it.quantity || 1;
              const resolved = resolveItem(it);
              const name = resolved.name;
              const price = Number(resolved.price) || 0;
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
