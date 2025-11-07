import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { id: 1, tableNo: 1, status: "available", seats: 4, current_order_customer_name: null },
  { id: 2, tableNo: 2, status: "booked", seats: 6, current_order_customer_name: "John Doe" },
  { id: 3, tableNo: 3, status: "available", seats: 2, current_order_customer_name: null },
  { id: 4, tableNo: 4, status: "booked", seats: 4, current_order_customer_name: "Jane Smith" },
  { id: 5, tableNo: 5, status: "available", seats: 8, current_order_customer_name: null },
  { id: 6, tableNo: 6, status: "available", seats: 4, current_order_customer_name: null },
  { id: 7, tableNo: 7, status: "booked", seats: 6, current_order_customer_name: "Alice Brown" },
  { id: 8, tableNo: 8, status: "available", seats: 2, current_order_customer_name: null },
];

const tablesSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    addTable: (state, action) => {
      const newTableNo = Math.max(...state.map(t => t.tableNo)) + 1;
      const newTable = {
        id: Date.now(),
        tableNo: newTableNo,
        status: "available",
        seats: 4,
        current_order_customer_name: null,
        ...action.payload // Allow overriding defaults
      };
      state.push(newTable);
    },
    updateTableStatus: (state, action) => {
      const { tableId, status, customerName } = action.payload;
      const table = state.find(t => t.id === tableId);
      if (table) {
        table.status = status;
        table.current_order_customer_name = customerName || null;
      }
    },
    removeTable: (state, action) => {
      return state.filter(table => table.id !== action.payload);
    },
    clearAllTables: (state) => {
      return [];
    },
    setTablesData: (state, action) => {
      return action.payload;
    }
  },
});

export const { addTable, updateTableStatus, removeTable, clearAllTables, setTablesData } = tablesSlice.actions;
export default tablesSlice.reducer;
