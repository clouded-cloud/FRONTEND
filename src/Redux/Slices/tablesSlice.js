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
    addNewTable: (state, action) => {
      // Guard: Reset if state is corrupted
      if (!Array.isArray(state)) {
        console.warn("Invalid tables ");
        return [];
      }

      // Compute next table number
      const newTableNo = state.length > 0
        ? Math.max(...state.map(t => t.tableNo || 0)) + 1
        : 1;

      // Create new table object
      const newTable = {
        id: Date.now(), // or use nanoid() for better IDs
        tableNo: newTableNo,
        status: "available",
        seats: 4,
        current_order_customer_name: null,
        ...action.payload, // allow overrides
      };

      // Mutate safely (Immer handles immutability)
      state.push(newTable);
    },

    updateTableStatus: (state, action) => {
      if (!Array.isArray(state)) return;
      const { tableId, status, customerName } = action.payload;
      const table = state.find(t => t.id === tableId);
      if (table) {
        table.status = status;
        table.current_order_customer_name = customerName ?? null;
      }
    },

    removeTable: (state, action) => {
      if (!Array.isArray(state)) return [];
      return state.filter(table => table.id !== action.payload);
    },

    clearAllTables: () => {
      return [];
    },

    setTablesData: (state, action) => {
      const data = action.payload;
      return Array.isArray(data) ? data : [];
    },
  },
});

export const {
  addNewTable,
  updateTableStatus,
  removeTable,
  clearAllTables,
  setTablesData,
} = tablesSlice.actions;

export default tablesSlice.reducer;