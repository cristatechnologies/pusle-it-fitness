// features/cart/slice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchCart,clearCart } from "./thunk";
import { CartState } from "./types";


const initialState: CartState = {
  data: null,
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.data = null;
      state.status = "idle";
      state.error = null;
      // Reset any other cart-related state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch cart";
      })
      .addCase(clearCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = "succeeded";
        state.data = null; // This is crucial for showing empty cart UI
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to clear cart";
      });
  },
});
export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;