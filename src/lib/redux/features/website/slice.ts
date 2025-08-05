// features/website/slice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchBaseData, fetchWebsiteSetup, initializeAppData } from "./thunks";
import { WebsiteState } from "./types";

const initialState: WebsiteState = {
  data: null,
  baseData: null, // Add this new field
  status: "idle",
  error: null,
};

const websiteSlice = createSlice({
  name: "website",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeAppData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBaseData.fulfilled, (state, action) => {
        state.baseData = action.payload;
      })
      .addCase(fetchWebsiteSetup.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(initializeAppData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Initialization failed";
      });
  },
});

export default websiteSlice.reducer;
