import { axiosWrapper } from "./axiosWrapper";
import axios from "axios";

// API Endpoints

// Auth Endpoints
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');

    if (!refreshToken || !accessToken) {
      console.warn('No tokens found in localStorage');
      // Clear any existing tokens and return success
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return { success: true, message: 'Logged out locally' };
    }

    console.log('Attempting logout with refresh token');

    // Try to call backend logout endpoint
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout/`, {
      refresh: refreshToken
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      timeout: 5000 // 5 second timeout
    });

    // Clear tokens on successful backend logout
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    console.log('Logout successful:', response.data);
    return response.data;

  } catch (error) {
    console.error('Logout error:', error);

    // Always clear tokens on frontend, even if backend fails
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Return success for frontend logout, but log the error
    return {
      success: true,
      message: 'Logged out locally (backend logout failed)',
      error: error.message
    };
  }
};

// Table Endpoints - FIXED CONSISTENCY
export const addTable = (data) => axiosWrapper.post("/api/tables/", data);
export const getTables = () => axiosWrapper.get("/api/tables/");
export const updateTable = ({ tableId, ...tableData }) =>
  axiosWrapper.put(`/api/tables/${tableId}/`, tableData);

// Category Endpoints
export const addCategory = (data) => axiosWrapper.post("/api/categories/", data);
export const getCategories = () => axiosWrapper.get("/api/categories/");

// Dish Endpoints
export const addDish = (data) => axiosWrapper.post("/api/menu-items/", data);
export const getDishes = () => axiosWrapper.get("/api/menu-items/");

// Payment Endpoints
export const createOrderRazorpay = (data) =>
  axiosWrapper.post("/api/payment/create-order", data);
export const verifyPaymentRazorpay = (data) =>
  axiosWrapper.post("/api/payment/verify-payment", data);

// Order Endpoints
export const addOrder = (data) => axiosWrapper.post("/api/orders/", data);
export const getOrders = () => axiosWrapper.get("/api/orders/");
export const updateOrderStatus = ({ orderId, orderStatus }) =>
  axiosWrapper.put(`/api/orders/${orderId}/`, { orderStatus });
