// src/utils/authApi.ts
import axios from "axios";
import { setCookie,deleteCookie  } from "cookies-next";
import { getAuthToken } from "./Auth-Token";
import { persistor,store } from "@/lib/redux/store";

import { resetCart } from "@/lib/redux/features/cart/slice";
import { resetWishlist } from "@/lib/redux/features/wishlist/slice";




const baseURL = process.env.NEXT_PUBLIC_BASE_URL;



export const loginUser = async (
  email: string,
  password: string,
  rememberMe: boolean
) => {
  try {
    const response = await axios.post(`${baseURL}api/store-login`, {
      email,
      password,
    });

    const data = response.data;

    // Store auth data in localStorage
    localStorage.setItem("auth", JSON.stringify(data));

    // Set cookie if remember me is checked
    if (rememberMe) {
      setCookie("userData", JSON.stringify(data), {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return data;
  } catch (error) {
    throw error;
  }
};



// Add this to authApi.ts
export const registerUser = async (
  fname: string,
  lname: string,
  email: string,
  password: string,
  confirmPassword: string,
  agree: boolean,
  phone?: string
) => {
  try {
    const response = await axios.post(`${baseURL}api/store-register`, {
      name: `${fname} ${lname}`,
      email,
      password,
      password_confirmation: confirmPassword,
      agree: agree ? 1 : "",
      phone: phone ? phone : "",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


// export const forgotPassword = async (email: string) => {
//   try {
//     const response = await axios.post(`${baseURL}send-forget-password`, {
//       email,
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const sendOtp = async (email: string) => {
  try {
    const response = await axios.post(`${baseURL}api/send-forget-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
  confirmPassword: string
) => {
  try {
    const response = await axios.post(`${baseURL}api/store-reset-password/${otp}`, {
      email,
   
      password: newPassword,
      password_confirmation: confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const logoutUser = async () => {
  try {
    const token = getAuthToken();
    if (token) {
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/logout?token=${token}`);
    }

    // Clear auth data
    localStorage.removeItem("auth");
    deleteCookie("userData");

    // Reset Redux states
    store.dispatch(resetCart());
    store.dispatch(resetWishlist());

    // Purge the persisted state
    persistor.pause(); // Pause automatic persistence
    persistor.flush().then(() => {
      return persistor.purge();
    });

    return true;
  } catch (error) {
    console.log("Logout failed:", error);
    return false;
  }
};
