// src/redux/slices/customerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customerName: "",
  customerPhone: "",
  orderId: "",
  orderType: "Dine in",
  guests: 0,
  table: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    // From first version - bulk update
    updateCustomer: (state, action) => {
      return { ...state, ...action.payload };
    },
    
    // From first version - clear all
    clearCustomer: (state) => {
      return {
        customerName: "",
        customerPhone: "",
        orderId: "",
        orderType: "Dine in",
        guests: 0,
        table: null,
      };
    },
    
    // From second version - set specific customer details
    setCustomer: (state, action) => {
      state.customerName = action.payload.name || action.payload.customerName || "";
      state.customerPhone = action.payload.phone || action.payload.customerPhone || "";
      state.guests = action.payload.guests || 0;
    },
    
    // From second version - update table only
    updateTable: (state, action) => {
      state.table = action.payload.table;
    },
    
    // From second version - remove customer (similar to clear but preserves some defaults)
    removeCustomer: (state) => {
      state.customerName = "";
      state.customerPhone = "";
      state.guests = 0;
      state.table = null;
      state.orderId = "";
      state.orderType = "Dine in";
    },
  },
});

export const { 
  updateCustomer, 
  clearCustomer, 
  setCustomer, 
  updateTable, 
  removeCustomer 
} = customerSlice.actions;

export default customerSlice.reducer;