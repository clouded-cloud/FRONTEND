import { axiosWrapper } from "./axiosWrapper";

// API Endpoints

// Auth Endpoints
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = (data) => axiosWrapper.post("/api/user/logout", data);

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
