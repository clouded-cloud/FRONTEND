import axios from "axios";
import API_CONFIG from "../config/api.js"; // Adjust path as needed

const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Create axios instance with base configuration
export const axiosWrapper = axios.create({
  baseURL: API_CONFIG.BASE_URL || "http://localhost:8000", // Should NOT include /api
  timeout: 10000, // 10 second timeout
  withCredentials: true,
  headers: { ...defaultHeader },
});

// Request interceptor - automatically add auth token to requests
axiosWrapper.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging (remove in production)
    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
axiosWrapper.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Log error for debugging
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
    
    if (error.response) {
      const { status, config } = error.response;
      
      switch (status) {
        case 401: // Unauthorized
          // ✅ FIX: Don't redirect if we're already on login page or if it's an auth endpoint
          const isAuthEndpoint = config.url.includes('/auth/');
          const isLoginPage = window.location.pathname === '/login';
          
          if (!isAuthEndpoint && !isLoginPage) {
            console.warn('🛑 Authentication failed, redirecting to login...');
            // Clear stored tokens
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Redirect to login page
            window.location.href = '/login';
          } else {
            console.warn('🛑 Auth failed on auth endpoint - preventing redirect loop');
          }
          break;
          
        case 403: // Forbidden
          console.warn('🚫 Access forbidden');
          break;
          
        case 404: // Not Found
          console.warn('🔍 Resource not found:', config?.url);
          break;
          
        default:
          console.warn(`⚠️ HTTP Error ${status}`);
      }
    }
    
    return Promise.reject(error);
  }
);
// Optional: Helper functions for token management
export const tokenHelper = {
  // Set tokens after login
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  },
  
  // Get current access token
  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },
  
  // Get current refresh token
  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },
  
  // Clear all tokens (logout)
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
};

export default axiosWrapper;