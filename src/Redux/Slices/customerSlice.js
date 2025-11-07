import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerName: "",
  customerPhone: "",
  guests: 0,
  table: null,
  orderId: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      state.customerName = action.payload.name;
      state.customerPhone = action.payload.phone;
      state.guests = action.payload.guests;
    },
    updateTable: (state, action) => {
      state.table = action.payload.table;
    },
    removeCustomer: (state) => {
      state.customerName = "";
      state.customerPhone = "";
      state.guests = 0;
      state.table = null;
      state.orderId = null;
    },
  },
});

export const { setCustomer, updateTable, removeCustomer } = customerSlice.actions;
export default customerSlice.reducer;
