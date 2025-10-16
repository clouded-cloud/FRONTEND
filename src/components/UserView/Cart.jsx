import React, { useState, useMemo, useCallback } from 'react';
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
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('🛒 Cart is empty! Add some delicious items first.');
      return;
    }

    if (!currentTable) {
      alert('🏷️ Please select a table first before placing your order.');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderData = {
        table_id: currentTable?.id,
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        special_instructions: '',
        payment_method: 'cash',
        tip_amount: 0
      };

      await placeOrder(orderData);
      alert('🎉 Order placed successfully! Your food will be ready soon.');
      clearCart();
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

      {/* Table Info */}
      {currentTable && (
        <div className="table-info-section">
          <h3>🏷️ Table {currentTable.table_number}</h3>
          <p>Capacity: {currentTable.capacity} seats</p>
        </div>
      )}

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

      {/* Table Selection Warning */}
      {!currentTable && (
        <div className="table-warning-section">
          <div className="warning-message">
            <span className="warning-icon">⚠️</span>
            <p>Please select a table to place your order</p>
          </div>
        </div>
      )}

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
          disabled={placingOrder || !currentTable}
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
