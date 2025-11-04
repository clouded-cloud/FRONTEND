import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./Slices/customerSlice"
import cartSlice from "./Slices/cartSlice";
import userSlice from "./Slices/userSlice";

const store = configureStore({
    reducer: {
        customer: customerSlice,
        cart : cartSlice,
        user : userSlice
    },

    devTools: import.meta.env.NODE_ENV !== "production",
});

export default store;