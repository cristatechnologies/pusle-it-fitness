// services/cart.ts
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { getAuthToken } from "./Auth-Token";
import { store } from "@/lib/redux/store";
import { fetchCart } from "@/lib/redux/features/cart/thunk";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const addToCart = async (
  productId: number,
  quantity: number,
  variants: { variantId: number; itemId: number }[]
): Promise<boolean> => {
  const token = getAuthToken();
  if (!token) {
    toast.error("Please login to add items to your cart");
    return false;
  }

  try {
    const body = {
      product_id: productId,
      quantity,
      variants: variants.map((v) => v.variantId),
      items: variants.map((v) => v.itemId),
    };

    const response = await axios.post(`${BASE_URL}api/user/add-to-cart`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success(response.data.message || "Item added to cart successfully");
    await store.dispatch(fetchCart());
    return true;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      toast.error(error.response.data.message);
      console.log("Error adding to cart:", error.response.data.message);
    } else {
      toast.error("An error occurred while adding to cart.");
      console.log("Error adding to cart:", error);
    }
    return false;
  }
};

export const removeCartItem = async (itemId: number): Promise<boolean> => {
  const token = getAuthToken();
  if (!token) {
    toast.error("Please login to modify your cart");
    return false;
  }

  try {
    const response = await axios.get(
      `${BASE_URL}api/cart-item-remove/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message || "Item removed successfully");
    await store.dispatch(fetchCart());
    return true;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      toast.error(error.response.data.message);
      console.log("Error removing cart item:", error.response.data.message);
    } else {
      toast.error("Failed to remove item");
      console.log("Error removing cart item:", error);
    }
    return false;
  }
};


export const incrementCartItem = async (itemId: number): Promise<boolean> => {
  const token = getAuthToken();
  if (!token) {
    toast.error("Please login to modify your cart");
    return false;
  }

  try {
    const response = await axios.get(
      `${BASE_URL}api/cart-item-increment/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message || "Quantity increased successfully");
    await store.dispatch(fetchCart());
    return true;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      toast.error(error.response.data.message);
      console.log("Error increasing quantity:", error.response.data.message);
    } else {
      toast.error("Failed to increase quantity");
      console.log("Error increasing quantity:", error);
    }
    return false;
  }
};

export const decrementCartItem = async (itemId: number): Promise<boolean> => {
  const token = getAuthToken();
  if (!token) {
    toast.error("Please login to modify your cart");
    return false;
  }

  try {
    const response = await axios.get(
      `${BASE_URL}api/cart-item-decrement/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message || "Quantity decreased successfully");
    await store.dispatch(fetchCart());
    return true;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      toast.error(error.response.data.message);
      console.log("Error decreasing quantity:", error.response.data.message);
    } else {
      toast.error("Failed to decrease quantity");
      console.log("Error decreasing quantity:", error);
    }
    return false;
  }
};