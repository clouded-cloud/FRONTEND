// src/https/Index.js
import { axiosWrapper } from "./axiosWrapper";
import axios from "axios";

// ==================== AUTH ENDPOINTS ====================
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');

    if (!refreshToken || !accessToken) {
      console.warn('No tokens found in localStorage');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return { success: true, message: 'Logged out locally' };
    }

    console.log('Attempting logout with refresh token');

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/logout/`,
      { refresh: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        timeout: 5000
      }
    );

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    console.log('Logout successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return {
      success: true,
      message: 'Logged out locally (backend logout failed)',
      error: error.message
    };
  }
};

// ==================== TABLE ENDPOINTS ====================
export const addTable = (data) => axiosWrapper.post("/api/tables/", data);
export const getTables = () => axiosWrapper.get("/api/tables/");
export const updateTable = ({ tableId, ...tableData }) =>
  axiosWrapper.put(`/api/tables/${tableId}/`, tableData);

// ==================== CATEGORY ENDPOINTS ====================
export const addCategory = (data) => axiosWrapper.post("/api/categories/", data);
export const getCategories = () => axiosWrapper.get("/api/categories/");

// ==================== MENU ITEM ENDPOINTS ====================
export const addDish = (data) => axiosWrapper.post("/api/menu-items/", data);
export const getDishes = () => axiosWrapper.get("/api/menu-items/");

// ==================== ORDER ENDPOINTS ====================
export const addOrder = (data) => axiosWrapper.post("/api/orders/", data);

// Fetch POS orders only (website orders endpoint not available)
export const getOrders = async () => {
  try {
    // Fetch POS orders from your existing endpoint
    const posRes = await axiosWrapper.get("/api/orders/");

    const posOrders = posRes?.data?.data || [];

    return {
      success: true,
      data: { data: posOrders }
    };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};

// Get website orders only (for debugging or separate display)
export const getWebsiteOrders = async () => {
  try {
    const res = await axiosWrapper.get("/api/website-orders/");
    // Normalize response to same shape as getOrders
    const websiteOrders = res?.data?.data || res?.data || [];
    return { success: true, data: { data: websiteOrders } };
  } catch (error) {
    console.error("Failed to fetch website orders:", error);
    throw error;
  }
};

export const updateOrderStatus = ({ orderId, orderStatus }) =>
  axiosWrapper.put(`/api/orders/${orderId}/`, { orderStatus });

// ==================== PAYMENT ENDPOINTS ====================
export const createOrderRazorpay = (data) =>
  axiosWrapper.post("/api/payment/create-order", data);
export const verifyPaymentRazorpay = (data) =>
  axiosWrapper.post("/api/payment/verify-payment", data);
