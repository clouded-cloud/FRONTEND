// src/redux/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  orderHistory: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // ✅ DEFENSIVE: Ensure state.items exists (fixes redux-persist issue)
      if (!state.items) {
        console.warn('state.items was undefined, resetting to []');
        state.items = [];
      }

      const newItem = action.payload;

      if (!newItem || !newItem.id) {
        console.error('Invalid payload for addToCart:', action.payload);
        return;
      }

      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }
    },

    removeFromCart: (state, action) => {
      if (!state.items) state.items = [];
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    updateQuantity: (state, action) => {
      if (!state.items) state.items = [];
      
      const { id, quantity } = action.payload;
      
      if (quantity < 1) {
        state.items = state.items.filter(item => item.id !== id);
        return;
      }

      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    resetCart: (state) => {
      state.items = [];
    },

    setCart: (state, action) => {
      // Handle payload being either { items: [...] } or just [...]
      const items = action.payload?.items || action.payload || [];
      state.items = Array.isArray(items) ? items : [];
    },

    addOrderToHistory: (state, action) => {
      if (!state.orderHistory) state.orderHistory = [];
      state.orderHistory.unshift(action.payload); // Add to beginning
      // Keep only last 50 orders
      if (state.orderHistory.length > 50) {
        state.orderHistory = state.orderHistory.slice(0, 50);
      }
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  resetCart,
  setCart,
  addOrderToHistory
} = cartSlice.actions;

export default cartSlice.reducer;