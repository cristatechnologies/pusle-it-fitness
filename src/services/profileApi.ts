// utils/profileApi.ts
import axios from "axios";
import { getAuthToken } from "./Auth-Token";
import { ProfileResponse } from "@/Theme/types/profile";
import { DashboardData } from "@/Theme/types/profile";
import { OrdersResponse } from "@/Theme/types/profile";
import { OrderDetailsResponse } from "@/Theme/types/profile";
import { Address } from "@/Theme/types/profile";
import { ReviewsResponse } from "@/Theme/types/profile";

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const authToken = getAuthToken();
  if (!authToken) throw new Error("Authentication required");

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/dashboard`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data;
};



export const fetchProfileData = async (
  token: string
): Promise<ProfileResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/my-profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch profile data");
  }

  return response.json();
};

export const updateProfile = async (
  token: string,
  formData: FormData
): Promise<{ notification: string }> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/update-profile?token=${token}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update profile");
  }

  return response.json();
};


type State = {
  id: number;
  name: string;
};
type City = {
  id: number;
  name: string;
};


export const fetchStates = async (
  token: string,
  countryId: number
): Promise<State[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/${countryId}?token=${token}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch states");
  }

  const data = await response.json();
  return data.states;
};



export const fetchCities = async (
  token: string,
  stateId: number
): Promise<City[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/city-by-state/${stateId}?token=${token}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }

  const data = await response.json();
  return data.cities;
};



export const fetchUserOrders = async (page: number = 1): Promise<OrdersResponse> => {
  const authToken = getAuthToken();
  
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/order`, {
      params: { page },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching user orders:", error);
    throw error;
  }
};


export const fetchOrderDetails = async (
  orderId: string
): Promise<OrderDetailsResponse> => {
  const authToken = getAuthToken();

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/user/order-show/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching order details:", error);
    throw error;
  }
};


// Add this to profileApi.ts
export const createAddress = async (
  data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    type: string;
    country: string;
    state: string;
    city: string;
    zip_code?: string;
    default_billing?: number;
    default_shipping?: number;
  }
): Promise<{ notification: string; address: Address }> => {
  const authToken = getAuthToken();
  if (!authToken) throw new Error("Authentication required");

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/address`,
    data,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data;
};



export interface AddressesResponse {
  addresses: Address[];
}

export const fetchAllAddresses = async (): Promise<AddressesResponse> => {
  const authToken = getAuthToken();
  if (!authToken) throw new Error("Authentication required");

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/address`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data;
};

export const fetchAddressById = async (id: number): Promise<Address> => {
  const authToken = getAuthToken();
  if (!authToken) throw new Error("Authentication required");

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/address/${id}`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data.address; // Add .address here to match API structure
};

export const updateAddress = async (
  id: number,
  data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    type: string;
    country: string;
    state: string;
    city: string;
    zip_code?: string;
  }
): Promise<{ notification: string }> => {
  const authToken = getAuthToken();
  if (!authToken) throw new Error("Authentication required");

  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/address/${id}`,
    data,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data;
};


export const deleteAddress = async (addressId: number): Promise<{ notification: string }> => {
  const authToken = getAuthToken();
  if (!authToken) throw new Error("Authentication required");

  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/user/address/${addressId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.notification || "Failed to delete address");
    }
    throw new Error("Failed to delete address");
  }
};





export const fetchUserReviews = async (): Promise<ReviewsResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/review`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user reviews");
  }

  return response.json();
};




export const updatePassword = async (data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<{ notification: string }> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/update-password`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};