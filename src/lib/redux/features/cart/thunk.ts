// features/cart/thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authenticatedFetch } from "@/lib/utils/api";
import { CartResponse } from "./types";
import { getAuthToken } from "@/services/Auth-Token";

export const fetchCart = createAsyncThunk<CartResponse>(
  "cart/fetchCart",
  async () => {
    const token = getAuthToken();
    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/user/cart`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch cart");
    return response.json();
  }
);



export const clearCart = createAsyncThunk<{ message: string }>(
  "cart/clearCart",
  async () => {
    const token = getAuthToken();
    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/cart-clear`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to clear cart");
    return response.json();
  }
);
