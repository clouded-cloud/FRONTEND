// src/services/dataService.js
import api from './api';
import API_CONFIG from '../config/api';

class DataService {
  static async get(endpoint, params = {}) {
    try {
      const response = await api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async post(endpoint, data = {}) {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async put(endpoint, data = {}) {
    try {
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async delete(endpoint) {
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
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

// Export specific services for your components
export const UserService = {
  getAll: () => DataService.get(API_CONFIG.ENDPOINTS.USERS),
  getById: (id) => DataService.get(`${API_CONFIG.ENDPOINTS.USERS}${id}/`),
  create: (data) => DataService.post(API_CONFIG.ENDPOINTS.USERS, data),
  update: (id, data) => DataService.put(`${API_CONFIG.ENDPOINTS.USERS}${id}/`, data),
  delete: (id) => DataService.delete(`${API_CONFIG.ENDPOINTS.USERS}${id}/`),
};

export default DataService;