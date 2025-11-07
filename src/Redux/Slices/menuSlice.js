import { createSlice } from "@reduxjs/toolkit";
import { menus as initialMenus } from "../../Constants";

const menuSlice = createSlice({
  name: "menu",
  initialState: initialMenus,
  reducers: {
    addCategory: (state, action) => {
      const newCategory = {
        id: Date.now(),
        name: action.payload.name,
        bgColor: action.payload.bgColor || "#b73e3e",
        icon: action.payload.icon || "🍲",
        items: []
      };
      state.push(newCategory);
    },
    addDish: (state, action) => {
      const { categoryName, dish } = action.payload;
      const category = state.find(cat => cat.name === categoryName);
      if (category) {
        const newDish = {
          id: Date.now(),
          name: dish.name,
          price: parseInt(dish.price),
          category: categoryName
        };
        category.items.push(newDish);
      }
    },
    removeCategory: (state, action) => {
      return state.filter(category => category.id !== action.payload);
    },
    removeDish: (state, action) => {
      const { categoryId, dishId } = action.payload;
      const category = state.find(cat => cat.id === categoryId);
      if (category) {
        category.items = category.items.filter(item => item.id !== dishId);
      }
    },
    updateCategory: (state, action) => {
      const { categoryId, updates } = action.payload;
      const category = state.find(cat => cat.id === categoryId);
      if (category) {
        Object.assign(category, updates);
      }
    },
    updateDish: (state, action) => {
      const { categoryId, dishId, updates } = action.payload;
      const category = state.find(cat => cat.id === categoryId);
      if (category) {
        const dish = category.items.find(item => item.id === dishId);
        if (dish) {
          Object.assign(dish, updates);
        }
      }
    },
    setMenuData: (state, action) => {
      return action.payload;
    }
  },
});

export const {
  addCategory,
  addDish,
  removeCategory,
  removeDish,
  updateCategory,
  updateDish,
  setMenuData
} = menuSlice.actions;
export default menuSlice.reducer;
