import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePos } from '../../contexts/PosContext';
import Menu from '../Menu/MenuPanel';
import Cart from './CartSummary';
import OrderSummary from '../Orders/OrderList';



const UserView = () => {
  const {
    currentOrder,
    tables,
    selectedTable,
    setSelectedTable,
    activeOrders,
    addToCart,
    clearCart,
    processPayment,
    isProcessingPayment
  } = usePos();

  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'cart', 'payment', 'tables'
  const [activeTab, setActiveTab] = useState('food'); // 'food', 'drinks', 'specials'
  const [quickItems, setQuickItems] = useState([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [customerCount, setCustomerCount] = useState(1);
  const [splitOrder, setSplitOrder] = useState(false);

  // Views for the POS system
  const VIEWS = {
    MENU: 'menu',
    CART: 'cart',
    PAYMENT: 'payment',
    TABLES: 'tables',
    ORDERS: 'orders'
  };

  // Load quick items (popular items)
  useEffect(() => {
    // This would typically come from your backend
    const popularItems = [
      { id: 1, name: 'Classic Burger', price: 12.99, category: 'American Classics', prepTime: 15 },
      { id: 4, name: 'Margherita Pizza', price: 14.99, category: 'Italian Cuisine', prepTime: 20 },
      { id: 16, name: 'Craft Beer', price: 6.99, category: 'Beverages', prepTime: 2 },
      { id: 19, name: 'Chocolate Cake', price: 8.99, category: 'Desserts', prepTime: 5 },
      { id: 10, name: 'Carne Asada Tacos', price: 13.99, category: 'Mexican Favorites', prepTime: 12 },
      { id: 7, name: 'Teriyaki Salmon', price: 17.99, category: 'Asian Fusion', prepTime: 18 }
    ];
    setQuickItems(popularItems);
  }, []);

  // Calculate order statistics
  const orderStats = useMemo(() => {
    const subtotal = currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    const itemCount = currentOrder.items.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, tax, total, itemCount };
  }, [currentOrder.items]);

  // Handle table selection
  const handleTableSelect = useCallback((table) => {
    setSelectedTable(table);
    setCurrentView(VIEWS.MENU);
  }, [setSelectedTable]);

  // Quick add item to cart
  const handleQuickAdd = useCallback((item) => {
    addToCart({
      ...item,
      notes: '',
      modifiers: []
    });
  }, [addToCart]);

  // Start new order
  const handleNewOrder = useCallback(() => {
    if (currentOrder.items.length > 0) {
      if (window.confirm('Start a new order? Current cart will be cleared.')) {
        clearCart();
        setSelectedTable(null);
        setOrderNotes('');
        setCustomerCount(1);
        setCurrentView(VIEWS.TABLES);
      }
    } else {
      setSelectedTable(null);
      setCurrentView(VIEWS.TABLES);
    }
  }, [currentOrder.items.length, clearCart, setSelectedTable]);

  // Proceed to checkout
  const handleCheckout = useCallback(() => {
    if (currentOrder.items.length === 0) {
      alert('Please add items to the cart before checkout');
      return;
    }
    if (!selectedTable) {
      alert('Please select a table before checkout');
      return;
    }
    setCurrentView(VIEWS.PAYMENT);
  }, [currentOrder.items.length, selectedTable]);

  // Handle payment completion
  const handlePaymentComplete = useCallback(async (paymentData) => {
    try {
      await processPayment({
        ...paymentData,
        orderId: `ORD-${Date.now()}`,
        tableId: selectedTable?.id,
        customerCount,
        notes: orderNotes,
        items: currentOrder.items
      });
      
      // Reset and go back to table view
      clearCart();
      setSelectedTable(null);
      setOrderNotes('');
      setCustomerCount(1);
      setCurrentView(VIEWS.TABLES);
      
      alert('Payment processed successfully!');
    } catch (error) {
      alert('Payment failed: ' + error.message);
    }
  }, [processPayment, selectedTable, customerCount, orderNotes, currentOrder.items, clearCart, setSelectedTable]);

  // Get status color for tables
  const getTableStatusColor = (table) => {
    switch (table.status) {
      case 'occupied': return '#ff6b6b';
      case 'reserved': return '#ffe66d';
      case 'cleaning': return '#4ecdc4';
      default: return '#51cf66';
    }
  };

  // Header with quick actions
  const Header = () => (
    <header className="pos-header">
      <div className="header-left">
        <h1 className="restaurant-name">🍽️ Bistro POS</h1>
        <div className="current-table">
          {selectedTable ? (
            <span className="table-badge" style={{ backgroundColor: getTableStatusColor(selectedTable) }}>
              Table {selectedTable.number} • {selectedTable.status.toUpperCase()}
            </span>
          ) : (
            <span className="no-table">No Table Selected</span>
          )}
        </div>
      </div>
      
      <div className="header-center">
        <div className="time-display">
          {new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </div>
      </div>

      <div className="header-right">
        <button 
          className="header-btn new-order-btn"
          onClick={handleNewOrder}
          title="Start New Order"
        >
          🆕 New Order
        </button>
        <button 
          className="header-btn tables-btn"
          onClick={() => setCurrentView(VIEWS.TABLES)}
          title="View Tables"
        >
          🪑 Tables ({tables.filter(t => t.status === 'available').length}/{tables.length})
        </button>
      </div>
    </header>
  );

  // Navigation tabs
  const NavigationTabs = () => (
    <div className="nav-tabs">
      <button
        className={`nav-tab ${activeTab === 'food' ? 'active' : ''}`}
        onClick={() => setActiveTab('food')}
      >
        🍕 Food Menu
      </button>
      <button
        className={`nav-tab ${activeTab === 'drinks' ? 'active' : ''}`}
        onClick={() => setActiveTab('drinks')}
      >
        🍹 Drinks & Bar
      </button>
      <button
        className={`nav-tab ${activeTab === 'specials' ? 'active' : ''}`}
        onClick={() => setActiveTab('specials')}
      >
        ⭐ Today's Specials
      </button>
    </div>
  );

  // Quick actions panel
  const QuickActions = () => (
    <div className="quick-actions-panel">
      <h3>🚀 Quick Add</h3>
      <div className="quick-items-grid">
        {quickItems.map(item => (
          <button
            key={item.id}
            className="quick-item-btn"
            onClick={() => handleQuickAdd(item)}
            title={`Add ${item.name} - $${item.price}`}
          >
            <span className="quick-item-name">{item.name}</span>
            <span className="quick-item-price">${item.price}</span>
            <span className="quick-item-time">⏱️ {item.prepTime}m</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Order summary sidebar
  const OrderSidebar = () => (
    <div className="order-sidebar">
      <div className="sidebar-header">
        <h3>📋 Current Order</h3>
        <button 
          className="clear-cart-btn"
          onClick={() => currentOrder.items.length > 0 && clearCart()}
          disabled={currentOrder.items.length === 0}
        >
          🗑️ Clear
        </button>
      </div>

      <div className="order-items-list">
        {currentOrder.items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <p>Cart is empty</p>
            <small>Add items from the menu</small>
          </div>
        ) : (
          currentOrder.items.map(item => (
            <div key={item.id} className="order-item">
              <div className="item-info">
                <span className="item-quantity">{item.quantity}x</span>
                <span className="item-name">{item.name}</span>
              </div>
              <div className="item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>

      {currentOrder.items.length > 0 && (
        <div className="order-totals">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>${orderStats.subtotal.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Tax (8%):</span>
            <span>${orderStats.tax.toFixed(2)}</span>
          </div>
          <div className="total-row grand-total">
            <span>Total:</span>
            <span>${orderStats.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="sidebar-actions">
        <div className="customer-info">
          <label>
            👥 Customers:
            <input
              type="number"
              min="1"
              max="20"
              value={customerCount}
              onChange={(e) => setCustomerCount(parseInt(e.target.value) || 1)}
              className="customer-input"
            />
          </label>
        </div>

        <div className="order-notes">
          <label>📝 Order Notes:</label>
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Add special instructions..."
            rows="2"
          />
        </div>

        <button
          className={`checkout-btn ${currentOrder.items.length === 0 ? 'disabled' : ''}`}
          onClick={handleCheckout}
          disabled={currentOrder.items.length === 0 || !selectedTable}
        >
          💳 Proceed to Payment
          <span className="item-count">{orderStats.itemCount} items</span>
        </button>
      </div>
    </div>
  );

  // Main content area based on current view
  const renderMainContent = () => {
    switch (currentView) {
      case VIEWS.TABLES:
        return (
          <div className="tables-view">
            <TableManagement 
              tables={tables}
              selectedTable={selectedTable}
              onTableSelect={handleTableSelect}
              activeOrders={activeOrders}
            />
          </div>
        );

      case VIEWS.PAYMENT:
        return (
          <div className="payment-view">
            <Payment
              order={currentOrder}
              orderStats={orderStats}
              selectedTable={selectedTable}
              customerCount={customerCount}
              orderNotes={orderNotes}
              onPaymentComplete={handlePaymentComplete}
              onBack={() => setCurrentView(VIEWS.CART)}
              isProcessing={isProcessingPayment}
            />
          </div>
        );

      case VIEWS.CART:
        return (
          <div className="cart-view">
            <Cart />
          </div>
        );

      case VIEWS.ORDERS:
        return (
          <div className="orders-view">
            <OrderSummary />
          </div>
        );

      default: // MENU view
        return (
          <div className="menu-view">
            <NavigationTabs />
            <div className="menu-content">
              <QuickActions />
              <div className="menu-main">
                <Menu />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="user-view">
      <Header />
      
      <div className="main-layout">
        <div className="content-area">
          {renderMainContent()}
        </div>
        
        {currentView === VIEWS.MENU && <OrderSidebar />}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          className={`nav-btn ${currentView === VIEWS.TABLES ? 'active' : ''}`}
          onClick={() => setCurrentView(VIEWS.TABLES)}
        >
          🪑 Tables
        </button>
        <button
          className={`nav-btn ${currentView === VIEWS.MENU ? 'active' : ''}`}
          onClick={() => setCurrentView(VIEWS.MENU)}
        >
          📱 Menu
        </button>
        <button
          className={`nav-btn ${currentView === VIEWS.CART ? 'active' : ''}`}
          onClick={() => setCurrentView(VIEWS.CART)}
        >
          🛒 Cart ({orderStats.itemCount})
        </button>
        <button
          className={`nav-btn ${currentView === VIEWS.ORDERS ? 'active' : ''}`}
          onClick={() => setCurrentView(VIEWS.ORDERS)}
        >
          📊 Orders
        </button>
      </nav>
    </div>
  );
};

export default UserView;