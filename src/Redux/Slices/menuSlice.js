// src/redux/slices/menuSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { menus as initialMenus } from "../../Constants/Index.js";
import { addCategory as addCategoryAPI, addDish as addDishAPI } from "../../https/Index";

// Async thunk for adding category
export const addCategoryAsync = createAsyncThunk(
  "menu/addCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await addCategoryAPI(categoryData);
      return response.data || categoryData; // Return the added category data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for adding dish
export const addDishAsync = createAsyncThunk(
  "menu/addDish",
  async (dishData, { rejectWithValue }) => {
    try {
      const response = await addDishAPI(dishData);
      return response.data || dishData; // Return the added dish data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: initialMenus, // ← This is your full array
  reducers: {
    addCategory: (state, action) => {
      // state is array → push works
      state.push({
        id: Date.now(),
        name: action.payload.name,
        bgColor: action.payload.bgColor || "#b73e3e",
        icon: action.payload.icon || "Plate",
        items: []
      });
    },
    addDish: (state, action) => {
      const { categoryId, ...dish } = action.payload;
      const category = state.find(c => c.id === categoryId);
      if (category) {
        category.items.push({
          id: Date.now(),
          ...dish,
          available: true
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCategoryAsync.fulfilled, (state, action) => {
        state.push({
          id: Date.now(),
          ...action.payload,
          items: []
        });
      })
      .addCase(addDishAsync.fulfilled, (state, action) => {
        const { categoryId, ...dish } = action.payload;
        const category = state.find(c => c.id === categoryId);
        if (category) {
          category.items.push({
            id: Date.now(),
            ...dish,
            available: true
          });
        }
      });
  }
});

export const { addCategory, addDish } = menuSlice.actions;
export default menuSlice.reducer;
