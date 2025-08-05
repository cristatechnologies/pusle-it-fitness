// features/homepage/slice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchHomepageData } from "./thunks";
import { HomepageState } from "./types";

const initialState: HomepageState = {
  data: null,
  status: "idle",
  error: null,
};

const homepageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomepageData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHomepageData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchHomepageData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch homepage data";
      });
      
  },
});

export default homepageSlice.reducer;
