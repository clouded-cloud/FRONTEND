import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeFromCart, clearCart } from "../../redux/slices/cartSlice";
import { addOrder } from "../../redux/slices/orderSlice";
import { useSnackbar } from "notistack";

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

  const handleCheckout = () => {
    if (!items.length) {
      enqueueSnackbar("Cart is empty", { variant: "warning" });
      return;
    }

    const orderPayload = {
      items: items.map(({ id, name, price, quantity, description }) => ({ id, name, price, quantity, description })),
      total,
      customer: {
        name: customer.customerName || "Walk-in",
        phone: customer.customerPhone || "",
      },
      createdAt: new Date().toISOString(),
      status: "Pending",
    };

    dispatch(addOrder(orderPayload));
    dispatch(clearCart());
    enqueueSnackbar("Order placed — moved to Orders", { variant: "success" });
  };

  return (
    <aside className="w-full lg:w-80 bg-white border rounded-lg p-4 shadow sticky top-6 h-fit">
      <h3 className="text-lg font-semibold mb-3">Cart</h3>

      {items.length === 0 ? (
        <div className="text-sm text-gray-500">Your cart is empty</div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-start gap-3">
    const navigate = useNavigate();

    const placeOrderLocal = (payload) => {
      dispatch(addOrderRedux(payload));
      dispatch(clearCart());
      enqueueSnackbar("Order placed locally", { variant: "success" });
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
        },
        createdAt: new Date().toISOString(),
        orderStatus: "Pending",
      };

      try {
        const res = await addOrderApi(payload);
        const saved = res?.data || payload;
        dispatch(addOrderRedux(saved));
        dispatch(clearCart());
        enqueueSnackbar("Order checked out and saved to server", { variant: "success" });
        // navigate to orders page
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
      const receiptHtml = `
        <html>
          <head>
            <title>Receipt</title>
            <style>body{font-family: Arial, sans-serif;padding:20px} .item{display:flex;justify-content:space-between;margin-bottom:8px}</style>
          </head>
          <body>
            <h2>Receipt</h2>
            <div>Time: ${new Date().toLocaleString()}</div>
            <hr />
            ${items
              .map(
                (it) =>
                  `<div class="item"><div>${it.name} x ${it.quantity || 1}</div><div>KSH ${((Number(it.price)||0)*(it.quantity||1)).toFixed(2)}</div></div>`
              )
              .join("")}
            <hr />
            <div style="display:flex;justify-content:space-between;font-weight:bold"> <div>Total</div><div>KSH ${total}</div></div>
          </body>
        </html>
      `;

      const w = window.open("", "PRINT", "width=600,height=800");
      if (w) {
        w.document.write(receiptHtml);
        w.document.close();
        w.focus();
        w.print();
        w.close();
      }
    };
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
            <button onClick={handleCheckout} className="w-full bg-blue-600 text-white py-2 rounded-lg">Checkout</button>
              <button onClick={checkout} className="w-full bg-blue-600 text-white py-2 rounded-lg">Checkout (Server)</button>
              <button onClick={() => placeOrderLocal({
                items: items.map(({ id, name, price, quantity, description }) => ({ id, name, price, quantity, description })),
                total,
                customer: { name: customer.customerName || "Walk-in", phone: customer.customerPhone || "" },
                createdAt: new Date().toISOString(),
                orderStatus: "Pending",
              })} className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg">Place Order (Local)</button>
              <button onClick={printReceipt} className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded-lg">Print Receipt</button>
              <button onClick={() => dispatch(clearCart())} className="w-full mt-2 bg-gray-100 text-gray-700 py-2 rounded-lg">Clear Cart</button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default CartSidebar;
