// src/redux/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import all slices
import customerSlice from "./slices/customerSlice.js";
import cartSlice from "./slices/cartSlice.js"; // Fixed: was 'cartslice.js'
import userSlice from "./slices/userSlice.js";
import tablesSlice from "./slices/tablesSlice.js";
import menuSlice from "./slices/menuSlice.js";
import orderSlice from "./slices/orderSlice.js"; // Optional – add if using
import { menus as initialMenus } from "../Constants/Index.js";

// ──────────────────────────────────────────────────────────────
// 1. Transform: Prevent corrupted cart state on rehydrate
// ──────────────────────────────────────────────────────────────
const cartTransform = createTransform(
  // inbound (to storage)
  (inboundState) => inboundState,
  // outbound (from storage → Redux)
  (outboundState) => {
    if (!outboundState || typeof outboundState !== "object") {
      return { items: [], customerName: "", customerPhone: "" };
    }
    return {
      ...outboundState,
      items: Array.isArray(outboundState.items) ? outboundState.items : [],
      customerName: outboundState.customerName || "",
      customerPhone: outboundState.customerPhone || "",
    };
  },
  { whitelist: ["cart"] }
);

// Validate persisted menu state -> ensure it's an array and fallback to seed data
const menuTransform = createTransform(
  // inbound: store -> storage
  (inboundState) => inboundState,
  // outbound: storage -> store
  (outboundState) => {
    if (!outboundState) return initialMenus;
    if (Array.isArray(outboundState)) return outboundState;
    // if persisted shape is an object with .menus, use it
    if (outboundState.menus && Array.isArray(outboundState.menus)) return outboundState.menus;
    return initialMenus;
  },
  { whitelist: ["menu"] }
);

// ──────────────────────────────────────────────────────────────
// 2. Persist Config
// ──────────────────────────────────────────────────────────────
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["cart", "tables", "menu"], // Only persist what you need
  transforms: [cartTransform, menuTransform],
};

// ──────────────────────────────────────────────────────────────
// 3. Root Reducer
// ──────────────────────────────────────────────────────────────
const rootReducer = combineReducers({
  customer: customerSlice,
  cart: cartSlice,
  user: userSlice,
  tables: tablesSlice,
  menu: menuSlice,
  orders: orderSlice, // Optional – remove if not used
});

// ──────────────────────────────────────────────────────────────
// 4. Persisted Reducer
// ──────────────────────────────────────────────────────────────
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ──────────────────────────────────────────────────────────────
// 5. Store Setup
// ──────────────────────────────────────────────────────────────
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
          "persist/REGISTER",
        ],
      },
    }),
});

// ──────────────────────────────────────────────────────────────
// 6. Export persistor
// ──────────────────────────────────────────────────────────────
export const persistor = persistStore(store);
export default store;