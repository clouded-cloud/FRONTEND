import React, { createContext, useState, useContext } from 'react';
import { ordersAPI } from '../../services/api.js';

const OrderContext = createContext();

export function useOrder() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const createOrder = async () => {
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await ordersAPI.createOrder(orderData);
      clearCart();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to create order';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getOrders();
      setOrders(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch orders';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    orders,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    createOrder,
    fetchOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export default OrderContext;