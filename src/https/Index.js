import { axiosWrapper } from "./axiosWrapper";

// API Endpoints

// Auth Endpoints - ALL need /api prefix
export const login = (data) => axiosWrapper.post("/api/auth/login/", data);
export const register = (data) => axiosWrapper.post("/api/auth/register/", data);
export const getUserData = () => axiosWrapper.get("/api/auth/user/");
export const logout = () => axiosWrapper.post("/api/auth/logout/");

// Table Endpoints - ✅ Already correct
export const addTable = (data) => axiosWrapper.post("/api/table/", data);
export const getTables = () => axiosWrapper.get("/api/table");
export const updateTable = ({ tableId, ...tableData }) =>
  axiosWrapper.put(`/api/table/${tableId}`, tableData);

// Payment Endpoints - Fixed double slash
export const createOrderRazorpay = (data) =>
  axiosWrapper.post("/api/payment/create-order", data);
export const verifyPaymentRazorpay = (data) =>
  axiosWrapper.post("/api/payment/verify-payment", data); // Removed double //

// Order Endpoints - ✅ Already correct
export const addOrder = (data) => axiosWrapper.post("/api/order/", data);
export const getOrders = () => axiosWrapper.get("/api/order");
export const updateOrderStatus = ({ orderId, orderStatus }) =>
  axiosWrapper.put(`/api/order/${orderId}`, { orderStatus });

// Menu Endpoints (if needed)
export const getMenuItems = () => axiosWrapper.get("/api/menu-items/");
export const getCategories = () => axiosWrapper.get("/api/categories/");

// Admin Endpoints (if needed)
export const getAdminOrders = () => axiosWrapper.get("/api/admin/orders/");
export const getAdminMenuItems = () => axiosWrapper.get("/api/admin/menu-items/");