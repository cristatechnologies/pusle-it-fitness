// features/homepage/thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { HomepageResponse } from "./types";

export const fetchHomepageData = createAsyncThunk<HomepageResponse>(
  "homepage/fetchData",
  async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api`
    );
    if (!response.ok) throw new Error("Failed to fetch homepage data");
    return response.json();
  }
);
