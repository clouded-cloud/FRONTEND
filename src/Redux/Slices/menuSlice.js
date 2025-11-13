// src/redux/slices/menuSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { menus as initialMenus } from "../../Constants/Index.js";

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
      const { categoryName, dish } = action.payload;
      const category = state.find(c => c.name === categoryName);
      if (category) {
        category.items.push({
          id: Date.now(),
          ...dish,
          available: true
        });
      }
    }
  }
});

export const { addCategory, addDish } = menuSlice.actions;
export default menuSlice.reducer;