import React, { useState, useEffect, useMemo } from 'react';
import { usePos } from '../contexts/PosContext';
import TableGrid from '../pos/tables/TableGrid';
import Menu from './Menu';
import Cart from './Cart';
import OrderList from '../pos/Orders/OrderList';
import './UserView.css';

const UserView = () => {
  const {
    menuItems,
    categories,
    selectedCategory,
    setSelectedCategory,
    fetchMenuItems,
    fetchCategories,
    fetchTables,
    fetchActiveOrders,
    cart,
    currentTable,
    likedCategories
  } = usePos();

  const [activeTab, setActiveTab] = useState('tables');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
    fetchTables();
    fetchActiveOrders();
  }, [fetchMenuItems, fetchCategories, fetchTables, fetchActiveOrders]);

  // Handle responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tabs = useMemo(() => [
    {
      id: 'tables',
      label: '🏷️ Tables',
      component: TableGrid,
      badge: null
    },
    {
      id: 'menu',
      label: '🍽️ Menu',
      component: Menu,
      badge: null
    },
    {
      id: 'orders',
      label: '📋 Orders',
      component: OrderList,
      badge: null
    },
  ], []);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const likedCount = likedCategories.length;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (isMobile) {
      setShowMobileCart(false);
    }
  };

  return (
    <div className="user-view">
      {/* Enhanced Header with Breadcrumb */}
      <div className="user-header">
        <div className="header-content">
          <div className="breadcrumb">
            <span className="breadcrumb-item">🏠 Home</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-item active">Customer Ordering</span>
          </div>
          <h1 className="main-title">
            🍽️ Restaurant POS System
            <span className="subtitle">Customer Portal</span>
          </h1>
        </div>
      </div>

      <div className="user-content">
        <div className="menu-cart-layout">
          <div className="menu-section">
            <Menu />
          </div>

          <div className="cart-sidebar">
            <Cart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;
