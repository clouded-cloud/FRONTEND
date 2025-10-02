import React, { useState, useEffect } from 'react';
import { useOrder } from '../contexts/OrderContext';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart } = useOrder();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu/items/');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="menu">
      <div className="menu-categories">
        <button 
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-items">
        {filteredItems.map(item => (
          <div key={item.id} className="menu-item-card">
            <div className="item-image">
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="image-placeholder">📷</div>
              )}
            </div>
            <div className="item-info">
              <h3>{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <div className="item-footer">
                <span className="item-price">${item.price}</span>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(item)}
                >
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;