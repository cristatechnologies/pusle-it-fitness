// services/fetch-country-fetch-state.ts

import { getAuthToken } from "./Auth-Token";
import axios from "axios";

export const fetchCountries = async (): Promise<
  Array<{ id: number; name: string }>
> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/address/create`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.countries;
};

export const fetchStatesByCountry = async (
  countryId: number
): Promise<Array<{ id: number; name: string }>> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/${countryId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.states;
};

export const fetchCitiesByState = async (
  stateId: number
): Promise<Array<{ id: number; name: string }>> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/city-by-state/${stateId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.cities;
};
