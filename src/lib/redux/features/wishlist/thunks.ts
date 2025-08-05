// features/wishlist/thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import auth from "@/lib/utils/auth";
import { WishlistResponse } from "./types";
import { getAuthToken } from "@/services/Auth-Token";

export const fetchWishlist = createAsyncThunk<
  WishlistResponse,
  void,
  { rejectValue: string }
>("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
  try {
    const authData = auth();
    if (!authData || !("access_token" in authData)) {
      return rejectWithValue("Not authenticated");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/user/wishlist`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.access_token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch wishlist");
    }

    return (await response.json()) as WishlistResponse;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});






export const addToWishlist = createAsyncThunk<
  WishlistResponse,
  number,
  { rejectValue: string }
>("wishlist/addToWishlist", async (productId, { rejectWithValue }) => {
  try {
    const authData = getAuthToken();
    if (!authData) {
      return rejectWithValue("Not authenticated");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/user/add-to-wishlist/${productId}`,
      {
        method: "GET", // Changed from GET to POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add to wishlist");
    }

    // After adding, fetch the updated wishlist
    const wishlistResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/user/wishlist`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData}`,
        },
      }
    );

    if (!wishlistResponse.ok) {
      throw new Error("Failed to fetch updated wishlist");
    }

    return (await wishlistResponse.json()) as WishlistResponse;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});



export const removeFromWishlist = createAsyncThunk<
  WishlistResponse,
  number,
  { rejectValue: string }
>("wishlist/removeFromWishlist", async (wishlistId, { rejectWithValue }) => {
  try {
    const authData = auth();
    if (!authData || !("access_token" in authData)) {
      return rejectWithValue("Not authenticated");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/user/remove-wishlist/${wishlistId}`,
      {
        method: "GET", // Changed from GET to DELETE
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.access_token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove from wishlist");
    }

    // After removal, fetch the updated wishlist
    const wishlistResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/user/wishlist`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.access_token}`,
        },
      }
    );

    if (!wishlistResponse.ok) {
      throw new Error("Failed to fetch updated wishlist");
    }

    return (await wishlistResponse.json()) as WishlistResponse;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});