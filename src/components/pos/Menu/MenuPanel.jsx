// src/components/pos/Menu/MenuPanel.jsx
import React from 'react';
import { usePos } from '../../contexts/PosContext';
import MenuItem from './MenuItem';

const MenuPanel = () => {
  const {
    menuItems,
    categories,
    selectedCategory,
    setSelectedCategory
  } = usePos();

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;



  return (
    <div className="menu-panel">
      {/* Category Filters */}
      <div className="category-filter">
        <button
          className={`category-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>

        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="menu-grid">
        {filteredItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="no-items-message">
          <p>No menu items found in this category</p>
        </div>
      )}
    </div>
  );
};

export default MenuPanel;
