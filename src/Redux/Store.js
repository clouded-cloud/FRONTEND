import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import customerSlice from "./slices/customerSlice.js"
import cartSlice from "./slices/cartSlice.js";
import userSlice from "./slices/userSlice.js";
import tablesSlice from "./slices/tablesSlice.js";
import menuSlice from "./slices/menuSlice.js";

const persistConfig = {
  key: "root",
  storage,
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
  devTools: import.meta.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
