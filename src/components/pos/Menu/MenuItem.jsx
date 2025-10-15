// src/components/pos/Menu/MenuItem.jsx
import React, { useState } from 'react';
import { usePos } from '../../contexts/PosContext';
import './MenuItem.css';

const MenuItem = ({ item }) => {
  const { addToCart, currentTable } = usePos();
  const [showCustomization, setShowCustomization] = useState(false);
  const [customizations, setCustomizations] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!currentTable) {
      alert('Please select a table first');
      return;
    }

    if (item.requires_customization && !customizations.trim()) {
      setShowCustomization(true);
      return;
    }

    addToCart(item, quantity, customizations);
    setCustomizations('');
    setQuantity(1);
    setShowCustomization(false);
  };

  const handleQuickAdd = () => {
    if (!item.requires_customization) {
      addToCart(item, 1, '');
    } else {
      setShowCustomization(true);
    }
  };

  return (
    <div className={`menu-item ${!item.available ? 'unavailable' : ''}`}>
      <div className="menu-item-image">
        {item.image ? (
          <img src={item.image} alt={item.name} />
        ) : (
          <div className="menu-item-placeholder">
            {item.name.charAt(0)}
          </div>
        )}
      </div>
      
      <div className="menu-item-info">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-description">{item.description}</p>
        <div className="item-price">${parseFloat(item.price).toFixed(2)}</div>
        
        {!item.available && (
          <div className="unavailable-badge">Unavailable</div>
        )}
      </div>

      <div className="menu-item-actions">
        {!showCustomization ? (
          <button
            className="add-to-cart-btn"
            onClick={handleQuickAdd}
            disabled={!item.available}
          >
            Add to Cart
          </button>
        ) : (
          <div className="customization-modal">
            <h4>Customize {item.name}</h4>
            
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="customization-input">
              <label>Special Instructions:</label>
              <textarea
                value={customizations}
                onChange={(e) => setCustomizations(e.target.value)}
                placeholder="E.g., No onions, extra sauce..."
                rows="3"
              />
            </div>

            <div className="customization-actions">
              <button
                className="confirm-btn"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowCustomization(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItem;