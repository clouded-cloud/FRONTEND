// src/services/authService.js
import api from './api';
import API_CONFIG from '../config/api';

class AuthService {
  static async login(username, password) {
    try {
      const response = await api.post(API_CONFIG.AUTH.LOGIN, {
        username,
        password,
      });
      
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        return response.data;
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async register(userData) {
    try {
      const response = await api.post(API_CONFIG.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }

  static async getCurrentUser() {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.PROFILE);
      localStorage.setItem('user_data', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  static getUserData() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  static handleError(error) {
    if (error.response) {
      return {
        message: error.response.data?.detail || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
      };
    } else {
      return {
        message: error.message,
        status: -1,
      };
    }
  }
}

export default AuthService;