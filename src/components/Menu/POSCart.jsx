import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../redux/slices/cartSlice";
import { enqueueSnackbar } from "notistack";
import { FiShoppingCart, FiX, FiMinus, FiPlus } from "react-icons/fi";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart?.items || []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty < 1) {
      handleRemove(id);
      return;
    }
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  const handleRemove = (id) => {
    const item = items.find((i) => i.id === id);
    dispatch(removeFromCart(id));
    enqueueSnackbar(`${item.name} removed`, { variant: "info" });
  };

  const handleClearCart = () => {
    if (window.confirm("Clear entire cart?")) {
      dispatch(clearCart());
      enqueueSnackbar("Cart cleared", { variant: "info" });
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    enqueueSnackbar("Checkout coming soon!", { variant: "info" });
    // Add your checkout logic here (API call, etc.)
  };

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <div className="cart-title">
          <FiShoppingCart className="icon" />
          <h3>Your Order</h3>
          <span className="item-count">{items.length} items</span>
        </div>
      </div>

      <div className="cart-body">
        {items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">Shopping Cart</div>
            <p className="empty-text">Your cart is empty</p>
            <p className="empty-subtext">Add delicious items from the menu</p>
          </div>
        ) : (
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-price">KSH {item.price.toFixed(2)} each</p>
                </div>

                <div className="item-actions">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="remove-btn"
                    title="Remove item"
                  >
                    <FiX />
                  </button>

                  <div className="quantity-control">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      <FiMinus />
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <div className="item-total">
                    KSH {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="cart-footer">
          <div className="total-section">
            <span className="total-label">Total</span>
            <span className="total-amount">KSH {total.toFixed(2)}</span>
          </div>

          <div className="action-buttons">
            <button onClick={handleClearCart} className="clear-btn">
              Clear Cart
            </button>
            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* Premium Blue Theme Styling */}
      <style jsx>{`
        :root {
          --primary: #2563eb;
          --primary-light: #3b82f6;
          --primary-dark: #1d4ed8;
          --accent: #0ea5e9;
          --bg: #f8fbff;
          --card: #ffffff;
          --border: #bae6fd;
          --text: #0c4a6e;
          --text-light: #0369a1;
          --shadow: 0 10px 30px rgba(37, 99, 235, 0.15);
          --radius: 20px;
        }

        .cart-sidebar {
          background: var(--card);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          height: fit-content;
          max-height: calc(100vh - 4rem);
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .cart-header {
          padding: 1.5rem 1.8rem;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
        }

        .cart-title {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .icon {
          font-size: 1.6rem;
        }

        .item-count {
          background: rgba(255,255,255,0.25);
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .cart-body {
          flex: 1;
          padding: 1.5rem 1.8rem;
          overflow-y: auto;
        }

        .empty-cart {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-light);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-text {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.5rem;
        }

        .empty-subtext {
          font-size: 0.95rem;
          opacity: 0.8;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .cart-item {
          background: var(--bg);
          border: 2px solid transparent;
          border-radius: 16px;
          padding: 1.2rem;
          transition: all 0.3s ease;
        }

        .cart-item:hover {
          border-color: var(--primary-light);
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
        }

        .item-info h4 {
          margin: 0 0 0.4rem;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text);
        }

        .item-price {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .item-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          gap: 1rem;
        }

        .remove-btn {
          width: 36px;
          height: 36px;
          background: #fee2e2;
          color: #ef4444;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .remove-btn:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.1);
        }

        .quantity-control {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }

        .qty-btn {
          width: 40px;
          height: 40px;
          background: white;
          border: none;
          color: var(--text);
          cursor: pointer;
          font-size: 1.1rem;
          transition: all 0.2s;
        }

        .qty-btn:hover {
          background: var(--primary);
          color: white;
        }

        .qty-display {
          min-width: 40px;
          text-align: center;
          font-weight: 700;
          color: var(--text);
        }

        .item-total {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--primary);
        }

        .cart-footer {
          padding: 1.8rem;
          background: var(--bg);
          border-top: 1px solid var(--border);
        }

        .total-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: white;
          border-radius: 14px;
          border: 2px solid var(--border);
        }

        .total-label {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text);
        }

        .total-amount {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary);
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .clear-btn {
          padding: 0.9rem;
          background: #fee2e2;
          color: #ef4444;
          border: 2px solid #fecaca;
          border-radius: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .clear-btn:hover {
          background: #ef4444;
          color: white;
        }

        .checkout-btn {
          padding: 1rem;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
          transition: all 0.3s;
        }

        .checkout-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(37, 99, 235, 0.4);
        }

        /* Scrollbar */
        .cart-body::-webkit-scrollbar {
          width: 6px;
        }

        .cart-body::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default CartSidebar;