import React, { useState } from 'react';
import { useOrder } from '../contexts/OrderContext';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    clearCart,
    placeOrder 
  } = useOrder();
  const [tableNumber, setTableNumber] = useState('');

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (!tableNumber) {
      alert('Please enter a table number');
      return;
    }

    const orderData = {
      table_number: tableNumber,
      order_type: 'dine-in', // or 'takeaway'
      status: 'pending'
    };

    await placeOrder(orderData);
    alert('Order placed successfully!');
  };

  if (cart.length === 0) {
    return (
      <div className="cart empty-cart">
        <h3>Cart</h3>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h3>Cart</h3>
      
      <div className="table-input">
        <label>Table Number:</label>
        <input
          type="text"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="Enter table number"
        />
      </div>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>${item.price}</p>
            </div>
            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                +
              </button>
            </div>
            <button 
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h4>Total: ${getCartTotal().toFixed(2)}</h4>
      </div>

      <div className="cart-actions">
        <button className="clear-btn" onClick={clearCart}>
          Clear Cart
        </button>
        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;