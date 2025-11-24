import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeFromCart, clearCart } from "../../redux/slices/cartSlice";
import { addOrder as addOrderRedux } from "../../redux/slices/orderSlice";
import { addOrder as addOrderApi } from "../../https/Index.js";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const items = useSelector((state) => state.cart?.items ?? []);
  const customer = useSelector((state) => state.customer || {});

  const total = useMemo(() => items.reduce((s, it) => s + (Number(it.price) || 0) * (it.quantity || 1), 0), [items]);

  const handleIncrease = (id) => dispatch(updateQuantity({ id, quantity: (items.find(i => i.id === id)?.quantity || 0) + 1 }));
  const handleDecrease = (id) => {
    const cur = items.find(i => i.id === id)?.quantity || 0;
    if (cur <= 1) return dispatch(removeFromCart(id));
    dispatch(updateQuantity({ id, quantity: cur - 1 }));
  };

  const navigate = useNavigate();

  const placeOrderLocal = (payload) => {
    dispatch(addOrderRedux(payload));
    dispatch(clearCart());
    enqueueSnackbar("Order placed locally", { variant: "success" });
    navigate("/orders");
  };

  const checkout = async () => {
    if (!items.length) {
      enqueueSnackbar("Cart is empty", { variant: "warning" });
      return;
    }

    const payload = {
      items: items.map(({ id, name, price, quantity, description }) => ({ id, name, price, quantity, description })),
      total,
      customer: {
        name: customer.customerName || "Walk-in",
        phone: customer.customerPhone || "",
        guests: customer.guests || 0,
      },
      table: customer.table || null,
      tableNo: customer.table?.tableNo || "N/A",
      createdAt: new Date().toISOString(),
      orderStatus: "Pending",
    };

    try {
      const res = await addOrderApi(payload);
      const saved = res?.data || payload;
      dispatch(addOrderRedux(saved));
      dispatch(clearCart());
      enqueueSnackbar("Order checked out and saved to server", { variant: "success" });
      navigate("/orders");
    } catch (err) {
      console.error("Checkout API error", err);
      enqueueSnackbar("Failed to checkout to server — saved locally instead", { variant: "warning" });
      placeOrderLocal(payload);
      navigate("/orders");
    }
  };

  const printReceipt = () => {
    if (!items.length) {
      enqueueSnackbar("Cart is empty", { variant: "warning" });
      return;
    }

    const TAX_RATE = 0.16; // 16% VAT
    const subtotal = total;
    const tax = (subtotal * TAX_RATE).toFixed(2);
    const grandTotal = (subtotal + Number(tax)).toFixed(2);

    const receiptHtml = `
      <html>
        <head>
          <title>Receipt - Sharubati</title>
          <style>
            @media print {
              body { margin: 0; padding: 10px; }
              button { display: none; }
            }
            body {
              font-family: 'Courier New', Arial, sans-serif;
              padding: 20px;
              max-width: 300px;
              margin: 0 auto;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .restaurant-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .receipt-date {
              font-size: 12px;
              color: #555;
            }
            .items {
              margin: 15px 0;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 12px;
            }
            .item-name {
              flex: 1;
            }
            .item-price {
              text-align: right;
              min-width: 80px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .summary {
              margin-top: 15px;
              font-size: 12px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .summary-row.total {
              font-weight: bold;
              font-size: 14px;
              border-top: 2px solid #000;
              padding-top: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 11px;
              color: #666;
            }
            .customer-info {
              font-size: 11px;
              margin-top: 10px;
              padding: 5px;
              background: #f5f5f5;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="restaurant-name">SHARUBATI</div>
            <div class="receipt-date">${new Date().toLocaleString()}</div>
          </div>

          <div class="divider"></div>

          <div class="items">
            ${items
              .map(
                (it) =>
                  `<div class="item-row">
                    <div class="item-name">${it.name}</div>
                    <div>x${it.quantity || 1}</div>
                  </div>
                  <div class="item-row" style="padding-left: 20px;">
                    <div style="font-size: 10px; color: #777;">KSH ${it.price || 0} × ${it.quantity || 1}</div>
                    <div class="item-price">KSH ${((Number(it.price) || 0) * (it.quantity || 1)).toFixed(2)}</div>
                  </div>`
              )
              .join("")}
          </div>

          <div class="divider"></div>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>KSH ${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Tax (16% VAT)</span>
              <span>KSH ${tax}</span>
            </div>
            <div class="summary-row total">
              <span>TOTAL</span>
              <span>KSH ${grandTotal}</span>
            </div>
          </div>

          ${
            customer.customerName || customer.customerPhone || customer.guests
              ? `<div class="customer-info">
                  ${customer.customerName ? `<div><strong>Customer:</strong> ${customer.customerName}</div>` : ""}
                  ${customer.customerPhone ? `<div><strong>Phone:</strong> ${customer.customerPhone}</div>` : ""}
                  ${customer.guests ? `<div><strong>Guests:</strong> ${customer.guests}</div>` : ""}
                  ${customer.table?.tableNo ? `<div><strong>Table:</strong> ${customer.table.tableNo}</div>` : ""}
                </div>`
              : ""
          }

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>www.sharubati.com</p>
          </div>
        </body>
      </html>
    `;

    // Open in new window and print (browser will convert to PDF via print dialog)
    const w = window.open("", "RECEIPT", "width=400,height=600");
    if (w) {
      w.document.write(receiptHtml);
      w.document.close();
      w.focus();
      setTimeout(() => {
        w.print();
      }, 250);
    }
    enqueueSnackbar("Receipt opened for printing/PDF export", { variant: "success" });
  };

  const sendReceiptWhatsApp = () => {
    if (!items.length) {
      enqueueSnackbar("Cart is empty", { variant: "warning" });
      return;
    }

    const TAX_RATE = 0.16; // 16% VAT
    const subtotal = total;
    const tax = (subtotal * TAX_RATE).toFixed(2);
    const grandTotal = (subtotal + Number(tax)).toFixed(2);

    const businessPhone = "254742462975"; // WhatsApp number

    const lines = [];
    lines.push("🧾 *SHARUBATI RECEIPT*");
    lines.push(`📅 ${new Date().toLocaleString()}`);
    lines.push("━".repeat(40));

    items.forEach((it, idx) => {
      const qty = it.quantity || 1;
      const price = Number(it.price) || 0;
      const lineTotal = (price * qty).toFixed(2);
      lines.push(`${idx + 1}. *${it.name}*`);
      lines.push(`   Qty: ${qty} | Unit: KSH ${price} | Total: KSH ${lineTotal}`);
    });

    lines.push("━".repeat(40));
    lines.push(`Subtotal: KSH ${subtotal.toFixed(2)}`);
    lines.push(`Tax (16% VAT): KSH ${tax}`);
    lines.push(`💰 *TOTAL: KSH ${grandTotal}*`);
    
    if (customer.customerName) lines.push(`\n👤 Customer: ${customer.customerName}`);
    if (customer.customerPhone) lines.push(`📱 Phone: ${customer.customerPhone}`);
    if (customer.guests) lines.push(`👥 Guests: ${customer.guests}`);
    if (customer.table?.tableNo) lines.push(`🪑 Table: ${customer.table.tableNo}`);

    lines.push("\n_Thank you for your business!_");
    lines.push("www.sharubati.com");

    const message = lines.join("\n");
    const waURL = `https://wa.me/${businessPhone}?text=${encodeURIComponent(message)}`;
    window.open(waURL, "_blank");
  };

  return (
<aside className="w-full lg:w-80 bg-white border rounded-lg p-4 shadow sticky top-6 h-fit pos-rounded-lg pos-shadow-md">
      <h3 className="pos-heading-tertiary mb-3">Cart</h3>

      {items.length === 0 ? (
        <div className="text-sm text-gray-500">Your cart is empty</div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium truncate">{it.name}</div>
                  <div className="text-sm text-gray-600">KSH {it.price}</div>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <button onClick={() => handleDecrease(it.id)} className="px-2 py-1 bg-gray-100 rounded">-</button>
                  <div className="px-2">{it.quantity || 1}</div>
                  <button onClick={() => handleIncrease(it.id)} className="px-2 py-1 bg-gray-100 rounded">+</button>
                  <button onClick={() => dispatch(removeFromCart(it.id))} className="ml-auto text-sm text-red-500">Remove</button>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-2 border-t pt-3">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600">Subtotal</div>
              <div className="font-semibold">KSH {total}</div>
            </div>
            <button onClick={checkout} className="w-full bg-blue-600 text-white py-2 rounded-lg">Checkout</button>
              <button onClick={checkout} className="w-full bg-blue-600 text-white py-2 rounded-lg">Checkout (Server)</button>
              <button onClick={() => placeOrderLocal({
                items: items.map(({ id, name, price, quantity, description }) => ({ id, name, price, quantity, description })),
                total,
                customer: { name: customer.customerName || "Walk-in", phone: customer.customerPhone || "", guests: customer.guests || 0 },
                table: customer.table || null,
                tableNo: customer.table?.tableNo || "N/A",
                createdAt: new Date().toISOString(),
                orderStatus: "Pending",
              })} className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg">Place Order (Local)</button>
              <button onClick={printReceipt} className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded-lg">Print Receipt</button>
              <button onClick={sendReceiptWhatsApp} className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                Send Receipt
              </button>
              <button onClick={() => dispatch(clearCart())} className="w-full mt-2 bg-gray-100 text-gray-700 py-2 rounded-lg">Clear Cart</button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default CartSidebar;
