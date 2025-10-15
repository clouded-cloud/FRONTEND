import React, { useState, useEffect } from 'react';
import { usePos } from '../contexts/PosContext';
import Menu from './Menu';
import Cart from './Cart';
import './UserView.css';

const UserView = () => {
  const { menuItems, categories, selectedCategory, setSelectedCategory, fetchMenuItems, fetchCategories } = usePos();
  const [activeTab, setActiveTab] = useState('menu');

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, [fetchMenuItems, fetchCategories]);

  const tabs = [
    { id: 'menu', label: 'Menu', component: Menu },
    { id: 'cart', label: 'Cart', component: Cart },
  ];

  return (
    <div className="user-view">
      <div className="user-header">
        <h1>Restaurant Menu</h1>
        <div className="user-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`user-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="user-content">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`user-tab-panel ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.component />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserView;
