// src/pages/POSDashboard.jsx
import React, { useState } from 'react';
import { usePos } from '../contexts/PosContext';
import TableGrid from '../components/pos/Tables/TableGrid';
import MenuPanel from '../components/pos/Menu/MenuPanel';
import CartPanel from '../components/pos/Cart/CartPanel';
import OrderList from '../components/pos/Orders/OrderList';
import './POSDashboard.css';

const POSDashboard = () => {
  const { loading, error, currentTable } = usePos();
  const [activeTab, setActiveTab] = useState('tables');

  if (loading) {
    return (
      <div className="pos-loading">
        <div className="loading-spinner"></div>
        <p>Loading POS System...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pos-error">
        <h2>Error Loading POS</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="pos-dashboard">
      {/* Header */}
      <header className="pos-header">
        <div className="pos-header-left">
          <h1>Restaurant POS</h1>
          {currentTable && (
            <div className="current-table">
              Table: {currentTable.table_number}
            </div>
          )}
        </div>
        
        <nav className="pos-nav">
          <button 
            className={`nav-btn ${activeTab === 'tables' ? 'active' : ''}`}
            onClick={() => setActiveTab('tables')}
          >
            Tables
          </button>
          <button 
            className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button 
            className={`nav-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            Menu
          </button>
        </nav>
        
        <div className="pos-header-right">
          <span className="staff-name">Staff User</span>
          <button className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="pos-main">
        {/* Left Panel - Tables or Orders */}
        <div className="pos-left-panel">
          {activeTab === 'tables' && <TableGrid />}
          {activeTab === 'orders' && <OrderList />}
          {activeTab === 'menu' && <MenuPanel />}
        </div>

        {/* Right Panel - Cart */}
        <div className="pos-right-panel">
          <CartPanel />
        </div>
      </div>
    </div>
  );
};

export default POSDashboard;