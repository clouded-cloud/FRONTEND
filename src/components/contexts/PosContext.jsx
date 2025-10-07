// ./src/components/contexts/PosContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';

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

      // Try the most common endpoint first
      const endpoint = '/menu/items/';
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
          { id: 1, name: 'Margherita Pizza', price: 12.99, category: 'Main' },
          { id: 2, name: 'Cheese Burger', price: 8.99, category: 'Main' },
          { id: 3, name: 'Caesar Salad', price: 6.99, category: 'Main' },
          { id: 4, name: 'French Fries', price: 3.99, category: 'Sides' },
          { id: 5, name: 'Coca Cola', price: 1.99, category: 'Drinks' },
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
        { id: 1, name: 'Margherita Pizza', price: 12.99, category: 'Main' },
        { id: 2, name: 'Cheese Burger', price: 8.99, category: 'Main' },
        { id: 3, name: 'Caesar Salad', price: 6.99, category: 'Main' },
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
      const response = await fetch(`${API_BASE}/menu/categories/`, {
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
        const mockCategories = ['Main', 'Sides', 'Drinks', 'Desserts'];
        setCategories(mockCategories);
        return mockCategories;
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Use mock categories as fallback
      const mockCategories = ['Main', 'Sides', 'Drinks', 'Desserts'];
      setCategories(mockCategories);
      return mockCategories;
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    menuItems,
    categories,
    loading,
    error,
    fetchMenuItems,
    fetchCategories,
    clearError,
  };

  return (
    <PosContext.Provider value={value}>
      {children}
    </PosContext.Provider>
  );
};