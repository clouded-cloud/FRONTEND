// src/services/posApi.js
import api from './api';

export const menuService = {
  getMenu: async () => {
    const response = await api.get('/menu/');
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },
  
  createMenuItem: async (itemData) => {
    const response = await api.post('/menu/items/', itemData);
    return response.data;
  },
  
  updateMenuItem: async (id, itemData) => {
    const response = await api.put(`/menu/items/${id}/`, itemData);
    return response.data;
  },
  
  deleteMenuItem: async (id) => {
    const response = await api.delete(`/menu/items/${id}/`);
    return response.data;
  }
};

export const tableService = {
  getTables: async () => {
    const response = await api.get('/tables/');
    return response.data;
  },
  
  updateTableStatus: async (id, status) => {
    const response = await api.put(`/tables/${id}/`, { status });
    return response.data;
  },
  
  createTable: async (tableData) => {
    const response = await api.post('/tables/', tableData);
    return response.data;
  }
};

export const orderService = {
  getActiveOrders: async () => {
    const response = await api.get('/orders/active/');
    return response.data;
  },
  
  createOrder: async (orderData) => {
    const response = await api.post('/orders/', orderData);
    return response.data;
  },
  
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/`, { status });
    return response.data;
  },
  
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  }
};

export const paymentService = {
  processPayment: async (paymentData) => {
    const response = await api.post('/payments/process/', paymentData);
    return response.data;
  },
  
  getPaymentMethods: async () => {
    const response = await api.get('/payments/methods/');
    return response.data;
  }
};