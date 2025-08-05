// features/website/thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { WebsiteSetupResponse } from "./types";

export const fetchBaseData = createAsyncThunk(
  "website/fetchBaseData",
  async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/homepage`);
    if (!response.ok) throw new Error("Failed to fetch base API data");
    return response.json();
  }
);

export const fetchWebsiteSetup = createAsyncThunk<WebsiteSetupResponse>(
  "website/fetchSetup",
  async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/website-setup`
    );
    if (!response.ok) throw new Error("Failed to fetch website setup");
    return response.json();
  }
);

// Combined thunk to run both sequentially
export const initializeAppData = createAsyncThunk(
  "website/initializeApp",
  async (_, { dispatch }) => {
    try {
      await dispatch(fetchBaseData()).unwrap();
      await dispatch(fetchWebsiteSetup()).unwrap();
    } catch (error) {
      console.log(error)
      throw new Error("Initialization failed");
    }
  }
);
