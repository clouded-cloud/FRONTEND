import axios from 'axios';
import API_CONFIG from '../config/api.js';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.REFRESH}`,
          { refresh: refreshToken }
        );
        
        const newToken = response.data.access;
        localStorage.setItem('access_token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (email, password) => 
    api.post(API_CONFIG.AUTH.LOGIN, { email, password }),
  
  register: (userData) => 
    api.post(API_CONFIG.AUTH.REGISTER, userData),
  
  refreshToken: (refreshToken) => 
    api.post(API_CONFIG.AUTH.REFRESH, { refresh: refreshToken }),
  
  verifyToken: (token) => 
    api.post(API_CONFIG.AUTH.VERIFY, { token }),
  
  getProfile: () => 
    api.get(API_CONFIG.ENDPOINTS.PROFILE),
};

export const menuAPI = {
  getProducts: (category = null) => {
    const params = category ? { category } : {};
    return api.get(API_CONFIG.ENDPOINTS.PRODUCTS, { params });
  },
  
  getProduct: (id) => 
    api.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}${id}/`),
  
  getCategories: () => 
    api.get(API_CONFIG.ENDPOINTS.CATEGORIES),
};

export const ordersAPI = {
  createOrder: (orderData) => 
    api.post(API_CONFIG.ENDPOINTS.ORDERS, orderData),
  
  getOrders: () => 
    api.get(API_CONFIG.ENDPOINTS.ORDERS),
  
  getOrder: (id) => 
    api.get(`${API_CONFIG.ENDPOINTS.ORDERS}${id}/`),
  
  updateOrderStatus: (id, status) => 
    api.patch(`${API_CONFIG.ENDPOINTS.ORDERS}${id}/`, { status }),
};

export const adminAPI = {
  getUsers: () => 
    api.get(API_CONFIG.ENDPOINTS.USERS),
  
  // Add more admin endpoints as needed
};

export default api;