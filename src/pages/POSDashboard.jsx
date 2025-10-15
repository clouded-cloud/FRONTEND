import React, { useEffect, useState } from 'react';
import { usePos } from '../components/contexts/PosContext';
import TableGrid from '../components/pos/tables/TableGrid';
import MenuPanel from '../components/pos/Menu/MenuPanel';
import CartPanel from '../components/pos/Cart/CartPanel';
import OrderList from '../components/pos/Orders/OrderList';
import './POSDashboard.css';

const POSDashboard = () => {
  const { fetchMenuItems, fetchCategories, fetchTables, fetchActiveOrders } = usePos();
  const [activeTab, setActiveTab] = useState('tables');

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
    fetchTables();
    fetchActiveOrders();
  }, [fetchMenuItems, fetchCategories, fetchTables, fetchActiveOrders]);

  const tabs = [
    { id: 'tables', label: 'Tables', component: TableGrid },
    { id: 'menu', label: 'Menu', component: MenuPanel },
    { id: 'orders', label: 'Orders', component: OrderList },
  ];

  return (
    <div className="pos-dashboard">
      <div className="pos-header">
        <h1>Point of Sale System</h1>
      </div>

      <div className="pos-content">
        <div className="pos-main">
          <div className="pos-tabs">
            <div className="tab-buttons">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  className={`tab-panel ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <tab.component />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pos-sidebar">
          <CartPanel />
        </div>
      </div>
    </div>
  );
};

export default POSDashboard;
