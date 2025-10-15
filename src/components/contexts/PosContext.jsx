// ./src/components/contexts/PosContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import { ordersAPI } from '../../services/api.js';

const PosContext = createContext();

export const usePos = () => {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error('usePos must be used within a PosProvider');
  }
  return context;
};

export const PosProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cart state
  const [cart, setCart] = useState([]);
  const [currentTable, setCurrentTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Use your actual Django backend URL - make sure this matches your Django server
  const API_BASE = 'http://localhost:8000/api';

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      console.log('🔍 Debug: Fetching menu items...');
      console.log('🔍 Debug: Token exists:', !!token);
      console.log('🔍 Debug: API Base:', API_BASE);

      // Use the correct endpoint from config
      const endpoint = '/menu-items/';
      const url = `${API_BASE}${endpoint}`;

      console.log('🔍 Debug: Fetching from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      console.log('🔍 Debug: Response status:', response.status);
      console.log('🔍 Debug: Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Debug: Menu items data received:', data);
        setMenuItems(data);
        return data;
      } else if (response.status === 404) {
        console.warn('⚠️ Menu items endpoint not found (404). Using mock data.');
        // Use mock data as fallback
        const mockData = [
          { id: 1, name: 'Margherita Pizza', price: 12.99, category: 'Main', available: true },
          { id: 2, name: 'Cheese Burger', price: 8.99, category: 'Main', available: true },
          { id: 3, name: 'Caesar Salad', price: 6.99, category: 'Main', available: true },
          { id: 4, name: 'French Fries', price: 3.99, category: 'Sides', available: true },
          { id: 5, name: 'Coca Cola', price: 1.99, category: 'Drinks', available: true },
        ];
        setMenuItems(mockData);
        return mockData;
      } else {
        throw new Error(`Request failed with status code ${response.status}`);
      }
    } catch (err) {
      console.error('❌ Error fetching menu items:', err);
      setError(err.message);

      // Even on error, provide mock data so the POS doesn't break
      const mockData = [
        { id: 1, name: 'Margherita Pizza', price: 12.99, category: 'Main', available: true },
        { id: 2, name: 'Cheese Burger', price: 8.99, category: 'Main', available: true },
        { id: 3, name: 'Caesar Salad', price: 6.99, category: 'Main', available: true },
      ];
      setMenuItems(mockData);

      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/categories/`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        return data;
      } else {
        // Fallback mock categories
        const mockCategories = [
          { id: 'Main', name: 'Main' },
          { id: 'Sides', name: 'Sides' },
          { id: 'Drinks', name: 'Drinks' },
          { id: 'Desserts', name: 'Desserts' }
        ];
        setCategories(mockCategories);
        return mockCategories;
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Use mock categories as fallback
      const mockCategories = [
        { id: 'Main', name: 'Main' },
        { id: 'Sides', name: 'Sides' },
        { id: 'Drinks', name: 'Drinks' },
        { id: 'Desserts', name: 'Desserts' }
      ];
      setCategories(mockCategories);
      return mockCategories;
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/tables/`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTables(data);
        return data;
      } else {
        // Fallback mock tables
        const mockTables = [
          { id: 1, table_number: 1, capacity: 4, status: 'available' },
          { id: 2, table_number: 2, capacity: 2, status: 'occupied' },
          { id: 3, table_number: 3, capacity: 6, status: 'available' },
          { id: 4, table_number: 4, capacity: 4, status: 'reserved' },
        ];
        setTables(mockTables);
        return mockTables;
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
      // Use mock tables as fallback
      const mockTables = [
        { id: 1, table_number: 1, capacity: 4, status: 'available' },
        { id: 2, table_number: 2, capacity: 2, status: 'occupied' },
        { id: 3, table_number: 3, capacity: 6, status: 'available' },
        { id: 4, table_number: 4, capacity: 4, status: 'reserved' },
      ];
      setTables(mockTables);
      return mockTables;
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const fetchActiveOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.getOrders();
      const orders = response.data.filter(order => order.status !== 'completed');
      setActiveOrders(orders);
      return orders;
    } catch (err) {
      console.error('Error fetching active orders:', err);
      setError(err.message);
      // Use mock orders as fallback
      const mockOrders = [
        {
          id: 'ord-001',
          table_number: 2,
          status: 'pending',
          items: [
            { quantity: 2, name: 'Margherita Pizza', price: 12.99 },
            { quantity: 1, name: 'Coca Cola', price: 1.99 }
          ],
          total_amount: 27.97,
          created_at: new Date().toISOString()
        }
      ];
      setActiveOrders(mockOrders);
      return mockOrders;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cart functions
  const addToCart = useCallback((item, quantity = 1, customizations = '') => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem =>
        cartItem.id === item.id && cartItem.customizations === customizations
      );

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id && cartItem.customizations === customizations
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity, customizations }];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId, customizations = '') => {
    setCart(prevCart => prevCart.filter(item =>
      !(item.id === itemId && item.customizations === customizations)
    ));
  }, []);

  const updateCartItem = useCallback((itemId, quantity, customizations = '') => {
    if (quantity <= 0) {
      removeFromCart(itemId, customizations);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId && item.customizations === customizations
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const placeOrder = useCallback(async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.createOrder({
        table_id: currentTable?.id,
        items: orderData.items,
        special_instructions: orderData.specialInstructions || '',
        payment_method: orderData.paymentMethod,
        tip_amount: orderData.tip || 0
      });

      clearCart();
      setCurrentTable(null);
      await fetchActiveOrders(); // Refresh orders
      return response.data;
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentTable, clearCart, fetchActiveOrders]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      setLoading(true);
      setError(null);

      await ordersAPI.updateOrderStatus(orderId, status);
      await fetchActiveOrders(); // Refresh orders
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchActiveOrders]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    // Menu data
    menuItems,
    categories,
    selectedCategory,
    setSelectedCategory,

    // Cart functionality
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,

    // Table management
    tables,
    currentTable,
    setCurrentTable,

    // Order management
    activeOrders,
    placeOrder,
    updateOrderStatus,

    // Loading and error states
    loading,
    error,
    clearError,

    // API functions
    fetchMenuItems,
    fetchCategories,
    fetchTables,
    fetchActiveOrders,
  };

  return (
    <PosContext.Provider value={value}>
      {children}
    </PosContext.Provider>
  );
};
