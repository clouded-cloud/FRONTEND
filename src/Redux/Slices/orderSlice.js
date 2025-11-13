import { createSlice, createEntityAdapter, nanoid } from "@reduxjs/toolkit";

// Helper to generate readable order number
const generateOrderNumber = () => {
  // Format: ORD-YYYYMMDD-HHMM-XXXX (e.g., ORD-20251113-0500-1234)
  // Or simpler: ORD + timestamp-based sequential (e.g., ORD-20251113-001234)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const randomSuffix = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${year}${month}${day}-${hours}${minutes}-${randomSuffix}`;
};

// ---------------------------------------------------------------------
// 1. Entity Adapter – normalises { ids: [], entities: { "id": {...} } }
// ---------------------------------------------------------------------
const ordersAdapter = createEntityAdapter({
  selectId: (order) => order._id || order.id,
  sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt), // newest first
});

const initialState = ordersAdapter.getInitialState({
  loading: false,
  error: null,
});

// ---------------------------------------------------------------------
// 2. Slice
// ---------------------------------------------------------------------
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // -----------------------------------------------------------------
    // Set full list (from API or mock)
    // -----------------------------------------------------------------
    setOrders: (state, action) => {
      ordersAdapter.setAll(state, action.payload);
      state.loading = false;
      state.error = null;
    },

    // -----------------------------------------------------------------
    // Add a new order (e.g. from checkout)
    // -----------------------------------------------------------------
    addOrder: {
      reducer: (state, action) => {
        ordersAdapter.addOne(state, action.payload);
      },
      prepare: (orderData) => {
        // Generate a readable order number if backend didn't provide one
        const id = orderData._id || orderData.id || generateOrderNumber();
        return { payload: { ...orderData, _id: id, id } };
      },
    },

    // -----------------------------------------------------------------
    // Update order (status, payment, etc.)
    // -----------------------------------------------------------------
    updateOrder: (state, action) => {
      const { _id, ...changes } = action.payload;
      ordersAdapter.updateOne(state, {
        id: _id,
        changes,
      });
    },

    // -----------------------------------------------------------------
    // Loading & Error
    // -----------------------------------------------------------------
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // -----------------------------------------------------------------
    // Optional: Clear all (for dev/reset)
    // -----------------------------------------------------------------
    clearOrders: ordersAdapter.removeAll,
  },
});

// ---------------------------------------------------------------------
// 3. Export actions
// ---------------------------------------------------------------------
export const {
  setOrders,
  addOrder,
  updateOrder,
  setLoading,
  setError,
  clearOrders,
} = orderSlice.actions;

// ---------------------------------------------------------------------
// 4. Export selectors (use these in components!)
// ---------------------------------------------------------------------
export const {
  selectAll: selectAllOrders,
  selectById: selectOrderById,
  selectIds: selectOrderIds,
} = ordersAdapter.getSelectors((state) => state.orders);

export default orderSlice.reducer;