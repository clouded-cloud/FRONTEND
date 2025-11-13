// src/redux/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import customerSlice from "./slices/customerSlice.js";
import cartSlice from "./slices/cartslice.js";
import userSlice from "./slices/userSlice.js";
import tablesSlice from "./slices/tablesSlice.js";
import menuSlice from "../redux/slices/menuSlice.js";

// ✅ Add transform to fix corrupted state
const cartTransform = {
  in: (state) => state,
  out: (state) => {
    // Ensure items is always an array when rehydrating
    if (!state || !Array.isArray(state.items)) {
      return { items: [] };
    }
    return state;
  },
};

const persistConfig = {
  key: "root",
  storage,
  transforms: [cartTransform], // ✅ Add this
  // whitelist: ['cart'] // Uncomment if you only want to persist cart
};

const rootReducer = combineReducers({
  customer: customerSlice,
  cart: cartSlice,
  user: userSlice,
  tables: tablesSlice,
  menu: menuSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/PURGE"],
      },
    }),
});

export const persistor = persistStore(store);
export default store;