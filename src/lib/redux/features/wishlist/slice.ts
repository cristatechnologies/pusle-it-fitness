// features/wishlist/slice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "./thunks";
import { WishlistState } from "./types";

const initialState: WishlistState = {
  data: null,
  status: "idle",
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlist: (state) => {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist cases
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch wishlist";
      })
      
      // Add to wishlist cases
      .addCase(addToWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add to wishlist";
      })
      
      // Remove from wishlist cases
      .addCase(removeFromWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to remove from wishlist";
      });
  },
});

export default wishlistSlice.reducer;
export const { resetWishlist } = wishlistSlice.actions;