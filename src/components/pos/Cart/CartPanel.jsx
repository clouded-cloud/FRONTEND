// src/components/pos/Cart/CartPanel.jsx
import React from 'react';
import { usePos } from '../../contexts/PosContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import './CartPanel.css';

const CartPanel = () => {
  const { cart, currentTable, clearCart } = usePos();

  if (!currentTable) {
    return (
      <div className="cart-panel-no-table">
        <div className="no-table-cart-message">
          <h3>No Table Selected</h3>
          <p>Select a table to start adding items</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-panel">
      <div className="cart-header">
        <h2>Order for Table {currentTable.table_number}</h2>
        {cart.length > 0 && (
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear All
          </button>
        )}
      </div>

      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Cart is empty</p>
            <p>Add items from the menu</p>
          </div>
        ) : (
          cart.map((item, index) => (
            <CartItem key={`${item.id}-${item.customizations}-${index}`} item={item} />
          ))
        )}
      </div>

      {cart.length > 0 && <CartSummary />}
    </div>
  );
};

export default CartPanel;