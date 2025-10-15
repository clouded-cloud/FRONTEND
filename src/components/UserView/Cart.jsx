import React, { useState } from 'react';
import { usePos } from '../contexts/PosContext';

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
    placeOrder,
    currentTable
  } = usePos();
  const [tableNumber, setTableNumber] = useState(currentTable?.table_number || '');
  const [orderType, setOrderType] = useState('dine-in');
  const [placingOrder, setPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('🛒 Cart is empty! Add some delicious items first.');
      return;
    }

    if (!tableNumber && orderType === 'dine-in') {
      alert('🏷️ Please enter a table number for dine-in orders.');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderData = {
        table_number: orderType === 'dine-in' ? tableNumber : null,
        order_type: orderType,
        status: 'pending'
      };

      await placeOrder(orderData);
      alert('🎉 Order placed successfully! Your food will be ready soon.');
      clearCart();
      setTableNumber('');
    } catch (error) {
      alert('❌ Failed to place order. Please try again.');
      console.error('Order placement error:', error);
    } finally {
      setPlacingOrder(false);
    }
  };

  const getItemTotal = (item) => {
    return (parseFloat(item.price) * item.quantity).toFixed(2);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some delicious items from our menu!</p>
          <div className="empty-cart-decoration">
            <span>🍕</span>
            <span>🥗</span>
            <span>☕</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Cart Header */}
      <div className="cart-header">
        <h2 className="cart-title">🛒 Your Order</h2>
        <span className="cart-count">{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Order Type Selection */}
      <div className="order-type-section">
        <h3>🍽️ Order Type</h3>
        <div className="order-type-buttons">
          <button
            className={`order-type-btn ${orderType === 'dine-in' ? 'active' : ''}`}
            onClick={() => setOrderType('dine-in')}
          >
            🪑 Dine In
          </button>
          <button
            className={`order-type-btn ${orderType === 'takeaway' ? 'active' : ''}`}
            onClick={() => setOrderType('takeaway')}
          >
            🥡 Takeaway
          </button>
        </div>

        {orderType === 'dine-in' && (
          <div className="table-input-section">
            <label>🏷️ Table Number</label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Enter table number"
              className="table-input"
            />
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="cart-items-section">
        {cart.map(item => (
          <div key={`${item.id}-${item.customizations || ''}`} className="cart-item-card">
            <div className="item-info">
              <h4 className="item-name">{item.name}</h4>
              <p className="item-price">${parseFloat(item.price).toFixed(2)} each</p>
              {item.customizations && (
                <p className="item-customizations">Custom: {item.customizations}</p>
              )}
            </div>

            <div className="item-controls">
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  ➖
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  ➕
                </button>
              </div>

              <div className="item-total">
                <span className="total-price">${getItemTotal(item)}</span>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax (8%):</span>
          <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>💰 Total:</span>
          <span>${(getCartTotal() * 1.08).toFixed(2)}</span>
        </div>
      </div>

      {/* Cart Actions */}
      <div className="cart-actions">
        <button
          className="clear-cart-btn"
          onClick={clearCart}
          disabled={placingOrder}
        >
          🗑️ Clear Cart
        </button>
        <button
          className="place-order-btn"
          onClick={handlePlaceOrder}
          disabled={placingOrder}
        >
          {placingOrder ? (
            <>
              <div className="loading-spinner-small"></div>
              Placing Order...
            </>
          ) : (
            <>
              ✅ Place Order
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Cart;
