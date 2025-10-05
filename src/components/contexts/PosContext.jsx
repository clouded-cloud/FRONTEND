// src/contexts/PosContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { menuService, orderService, tableService } from '../services/posApi';

const PosContext = createContext();

const initialState = {
  // Menu State
  menuItems: [],
  categories: [],
  selectedCategory: null,
  
  // Cart State
  cart: [],
  currentTable: null,
  
  // Tables State
  tables: [],
  
  // Orders State
  activeOrders: [],
  
  // UI State
  loading: false,
  error: null
};

function posReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_MENU_ITEMS':
      return { ...state, menuItems: action.payload };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'SET_TABLES':
      return { ...state, tables: action.payload };
    
    case 'SET_ACTIVE_ORDERS':
      return { ...state, activeOrders: action.payload };
    
    case 'SET_CURRENT_TABLE':
      return { ...state, currentTable: action.payload };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(
        item => item.id === action.payload.id && 
        item.customizations === action.payload.customizations
      );
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id && 
            item.customizations === action.payload.customizations
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => 
          !(item.id === action.payload.id && 
            item.customizations === action.payload.customizations)
        )
      };
    
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id && 
          item.customizations === action.payload.customizations
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    default:
      return state;
  }
}

export function PosProvider({ children }) {
  const [state, dispatch] = useReducer(posReducer, initialState);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [menuData, tablesData, ordersData] = await Promise.all([
        menuService.getMenu(),
        tableService.getTables(),
        orderService.getActiveOrders()
      ]);
      
      dispatch({ type: 'SET_MENU_ITEMS', payload: menuData.items });
      dispatch({ type: 'SET_CATEGORIES', payload: menuData.categories });
      dispatch({ type: 'SET_TABLES', payload: tablesData });
      dispatch({ type: 'SET_ACTIVE_ORDERS', payload: ordersData });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = (menuItem, quantity = 1, customizations = '') => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        customizations,
        menuItem // Store full item for reference
      }
    });
  };

  const removeFromCart = (itemId, customizations = '') => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id: itemId, customizations }
    });
  };

  const updateCartItem = (itemId, quantity, customizations = '') => {
    if (quantity <= 0) {
      removeFromCart(itemId, customizations);
    } else {
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: { id: itemId, quantity, customizations }
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setCurrentTable = (table) => {
    dispatch({ type: 'SET_CURRENT_TABLE', payload: table });
  };

  const setSelectedCategory = (categoryId) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: categoryId });
  };

  const placeOrder = async (orderData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const order = await orderService.createOrder({
        ...orderData,
        items: state.cart,
        tableId: state.currentTable?.id
      });
      
      // Clear cart after successful order
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'SET_CURRENT_TABLE', payload: null });
      
      // Refresh active orders
      const activeOrders = await orderService.getActiveOrders();
      dispatch({ type: 'SET_ACTIVE_ORDERS', payload: activeOrders });
      
      return order;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    setCurrentTable,
    setSelectedCategory,
    placeOrder,
    reloadData: loadInitialData
  };

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}

export const usePos = () => {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error('usePos must be used within a PosProvider');
  }
  return context;
};