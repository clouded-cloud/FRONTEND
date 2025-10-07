// src/components/pos/Cart/CartItem.jsx
import React from 'react';
import { usePos } from '../../contexts/PosContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = usePos();

  const handleQuantityChange = (newQuantity) => {
    updateCartItem(item.id, newQuantity, item.customizations);
  };

  const handleRemove = () => {
    removeFromCart(item.id, item.customizations);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h4 className="item-name">{item.name}</h4>
        {item.customizations && (
          <p className="item-customizations">{item.customizations}</p>
        )}
        <div className="item-price">${parseFloat(item.price).toFixed(2)} each</div>
      </div>

      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity - 1)}
          >
            -
          </button>
          <span className="quantity-display">{item.quantity}</span>
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            +
          </button>
        </div>

        <div className="item-total">
          ${parseFloat(totalPrice).toFixed(2)}
        </div>

        <button 
          className="remove-btn"
          onClick={handleRemove}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CartItem;