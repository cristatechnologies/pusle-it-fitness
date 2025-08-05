// features/compare/slice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CompareResponse, CompareState } from "./types";
import auth from "@/lib/utils/auth";

const initialState: CompareState = {
  data: null,
  status: "idle",
  error: null,
};

export const fetchCompareProducts = createAsyncThunk<
  CompareResponse | false,
  void
>("compare/fetchCompareProducts", async (_, { rejectWithValue }) => {
  const authData = auth();
  if (!authData) {
    return rejectWithValue("Authentication required");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/user/compare-product?token=${authData.access_token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch compare products");
    }

    const data: CompareResponse = await res.json();
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
});

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompareProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCompareProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload !== false) {
          state.data = action.payload;
        }
      })
      .addCase(fetchCompareProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default compareSlice.reducer;
