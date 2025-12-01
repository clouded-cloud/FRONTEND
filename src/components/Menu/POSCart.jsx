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
            <div className="empty-icon">🛒</div>
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

      <style jsx>{`
        .cart-sidebar {
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          height: fit-content;
          max-height: calc(100vh - 4rem);
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
        }

        .cart-sidebar:hover {
          box-shadow: var(--shadow-lg);
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
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .cart-body {
          flex: 1;
          padding: 1.5rem 1.8rem;
          overflow-y: auto;
          background: var(--bg-body);
        }

        .empty-cart {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-secondary);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-text {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.5rem;
        }

        .empty-subtext {
          font-size: 0.95rem;
          opacity: 0.8;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-item {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.2rem;
          transition: all 0.3s ease;
          animation: slideIn 0.3s ease-out;
        }

        .cart-item:hover {
          border-color: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: var(--shadow);
        }

        .item-info h4 {
          margin: 0 0 0.4rem;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .item-price {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
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
          background: #fef2f2;
          color: #dc3545;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: #dc3545;
          color: white;
          transform: scale(1.1);
        }

        .quantity-control {
          display: flex;
          align-items: center;
          background: var(--input-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          overflow: hidden;
        }

        .qty-btn {
          width: 36px;
          height: 36px;
          background: var(--input-bg);
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-btn:hover {
          background: var(--primary);
          color: white;
        }

        .qty-display {
          min-width: 36px;
          text-align: center;
          font-weight: 700;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .item-total {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--primary);
        }

        .cart-footer {
          padding: 1.5rem;
          background: #f8f9fa;
          border-top: 1px solid var(--border-color);
        }

        .total-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: var(--card-bg);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .total-label {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .total-amount {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary);
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .clear-btn {
          padding: 0.875rem;
          background: #fef2f2;
          color: #dc3545;
          border: 1.5px solid #fecaca;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .clear-btn:hover {
          background: #dc3545;
          color: white;
          transform: translateY(-1px);
        }

        .checkout-btn {
          padding: 1rem;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(44, 85, 48, 0.3);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(44, 85, 48, 0.4);
        }

        .checkout-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .checkout-btn:hover::before {
          left: 100%;
        }

        /* Animations */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Stagger animation for cart items */
        .cart-item:nth-child(1) { animation-delay: 0.1s; }
        .cart-item:nth-child(2) { animation-delay: 0.2s; }
        .cart-item:nth-child(3) { animation-delay: 0.3s; }
        .cart-item:nth-child(4) { animation-delay: 0.4s; }

        /* Custom scrollbar */
        .cart-body::-webkit-scrollbar {
          width: 6px;
        }

        .cart-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .cart-body::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }

        .cart-body::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .cart-sidebar {
            margin-bottom: 1rem;
            max-height: none;
          }

          .cart-header {
            padding: 1.25rem 1.5rem;
          }

          .cart-body {
            padding: 1.25rem 1.5rem;
          }

          .cart-footer {
            padding: 1.25rem;
          }

          .total-amount {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .cart-header {
            padding: 1rem 1.25rem;
          }

          .cart-title {
            font-size: 1.2rem;
          }

          .cart-body {
            padding: 1rem 1.25rem;
          }

          .cart-footer {
            padding: 1rem;
          }

          .item-actions {
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .quantity-control {
            order: 1;
          }

          .item-total {
            order: 2;
            margin-left: auto;
          }

          .remove-btn {
            order: 3;
          }

          .total-section {
            padding: 0.875rem;
          }

          .total-amount {
            font-size: 1.25rem;
          }

          .clear-btn, .checkout-btn {
            padding: 0.75rem;
            font-size: 0.9rem;
          }
        }

        /* Focus states for accessibility */
        .clear-btn:focus,
        .checkout-btn:focus,
        .qty-btn:focus,
        .remove-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--focus-ring);
        }
      `}</style>
    </div>
  );
};

export default CartSidebar;