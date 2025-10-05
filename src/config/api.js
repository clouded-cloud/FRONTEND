const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  
  AUTH: {
    LOGIN: '/auth/login/',
    REFRESH: '/token/refresh/',
    VERIFY: '/token/verify/',
    REGISTER: '/auth/register/',
  },
  
  ENDPOINTS: {
    USERS: '/users/',
    PROFILE: '/auth/profile/',
    PRODUCTS: '/menu-items/',
    ORDERS: '/orders/',
    CATEGORIES: '/categories/',
  },
  
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  TIMEOUT: 10000,
};

export default API_CONFIG;