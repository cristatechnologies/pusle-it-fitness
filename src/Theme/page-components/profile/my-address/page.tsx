"use client";

import type React from "react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { withAuth } from "../../../../../middleware/isAuth";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import {
  fetchAllAddresses,
  fetchAddressById,
  updateAddress,
  
} from "@/services/profileApi";
import { fetchCitiesByState, fetchCountries, fetchStatesByCountry } from "@/services/fetch-country-fetch-state";
import  { Address } from "@/Theme/types/profile";
import { getAuthToken } from "@/services/Auth-Token";
import ProfileNavbar from "../navbar";




interface EditFormData {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  address_2?: string;
  type?: "billing" | "shipping" | "home" | string;
  country_id?: number | string;
  state_id?: number | string;
  city_id?: string; // Keep as string to match API response
  zip_code?: string;
  default_billing?: number;
  default_shipping?: number;
}

const AddressPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({});
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [countries, setCountries] = useState<{ id: number; name: string }[]>(
    []
  );

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile/dashboard" },
    { label: "Addresses", href: "/profile/address" },
  ];

  useEffect(() => {
    const authToken = getAuthToken();
    setToken(authToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const loadAddresses = async () => {
      try {
        const data = await fetchAllAddresses();
        setAddresses(data.addresses);
      } catch (error) {
        toast.error("Failed to load addresses");
        console.log("Address error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAddresses();
  }, [token]);

  useEffect(() => {
    if (!editingAddressId || !token) return;

    const loadAddressForEdit = async () => {
      try {
        const address = await fetchAddressById(editingAddressId);

        // console.log(
        //   "Address for edit:",
        //   address.country_id,
        //   address.state_id,
        //   address.city_id
        // );
        const [statesData, citiesData] = await Promise.all([
          address.country_id
            ? fetchStatesByCountry(address.country_id)
            : Promise.resolve([]),
          address.state_id
            ? fetchCitiesByState(address.state_id)
            : Promise.resolve([]),
        ]);

        setEditFormData({
          ...address,
          country_id: address.country_id,
          state_id: address.state_id,
          city_id: address.city_id,
          type: address.type === "1" ? "billing" : "shipping",
        });

        setStates(statesData);
        setCities(citiesData);
        setShowForm(true);
      } catch (error) {
        toast.error("Failed to load address details");
        console.log("Address details error:", error);
      }
    };
    loadAddressForEdit();
  }, [editingAddressId, token]);

  const handleEditClick = async (address: Address) => {
    setEditingAddressId(address.id);
    setShowForm(true);

    try {
      // Fetch the full address details
      const addressDetails = await fetchAddressById(address.id);

      // Convert type from "home" to "shipping" if needed (or handle all cases)
      const addressType =
        addressDetails.type === "1"
          ? "billing"
          : addressDetails.type === "2"
          ? "shipping"
          : addressDetails.type; // Keep as-is for other values

      // Set the form data with the fetched details
      setEditFormData({
        id: addressDetails.id,
        name: addressDetails.name,
        email: addressDetails.email,
        phone: addressDetails.phone,
        address: addressDetails.address,
        country_id: addressDetails.country_id,
        state_id: addressDetails.state_id,
        city_id: addressDetails.city_id.toString(),
        zip_code: addressDetails.zip_code,
        type: addressType,
        default_billing: addressDetails.default_billing,
        default_shipping: addressDetails.default_shipping,
      });

      // Load states and cities based on the address
      if (addressDetails.country_id) {
        const statesData = await fetchStatesByCountry(
          addressDetails.country_id
        );
        setStates(statesData);
      }

      if (addressDetails.state_id) {
        const citiesData = await fetchCitiesByState(addressDetails.state_id);
        setCities(citiesData);
      }
    } catch (error) {
      toast.error("Failed to load address details");
      console.log("Address details error:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingAddressId(null);
    setEditFormData({});
    setShowForm(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!token) return;

    const loadInitialData = async () => {
      try {
        const [addressesData, countriesData] = await Promise.all([
          fetchAllAddresses(),
          fetchCountries(),
        ]);
        setAddresses(addressesData.addresses);
        setCountries(countriesData);
      } catch (error) {
        toast.error("Failed to load initial data");
        console.log("Initial data error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [token]);

  const handleCountryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const countryId = Number(e.target.value);
    setEditFormData((prev) => ({
      ...prev,
      country_id: countryId,
      state_id: "",
      city_id: "",
    }));

    if (countryId && token) {
      try {
        const statesData = await fetchStatesByCountry(countryId);
        setStates(statesData);
      } catch (error) {
        toast.error("Failed to load states");
        console.log("States error:", error);
      }
    }
  };

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = Number(e.target.value);
    setEditFormData((prev) => ({ ...prev, state_id: stateId, city_id: "" }));

    if (stateId && token) {
      try {
        const citiesData = await fetchCitiesByState(stateId);
        setCities(citiesData);
      } catch (error) {
        toast.error("Failed to load cities");
        console.log("Cities error:", error);
      }
    }
  };

  // In your handleCityChange function:
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value; // Keep as string
    setEditFormData((prev) => ({ ...prev, city_id: cityId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      // Convert type back to API format
      const apiType =
        editFormData.type === "billing"
          ? "1"
          : editFormData.type === "shipping"
          ? "2"
          : editFormData.type || "1"; // Default to "1" if undefined

      const addressData = {
        name: editFormData.name || "",
        email: editFormData.email || "",
        phone: editFormData.phone || "",
        address: editFormData.address || "",
        type: apiType,
        country: editFormData.country_id?.toString() || "",
        state: editFormData.state_id?.toString() || "",
        city: editFormData.city_id?.toString() || "",
        zip_code: editFormData.zip_code || "",
        default_billing: editFormData.default_billing || 0,
        default_shipping: editFormData.default_shipping || 0,
      };

      if (editingAddressId) {
        await updateAddress(editingAddressId, addressData);
        toast.success("Address updated successfully");
      } else {
        // Handle create new address if needed
      }

      // Refresh addresses
      const updatedAddresses = await fetchAllAddresses();
      setAddresses(updatedAddresses.addresses);
      setEditingAddressId(null);
      setEditFormData({});
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to update address");
      console.log("Update error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="font-manrope container mx-auto px-4 py-8">
        <h1 className="text-center text-2xl border-b-2 pb-8  font-bold">
          ADDRESS
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="max-w-3xl mx-auto">
              <div className=" pt-6">
                {!showForm ? (
                  <>
                    <p className="text-sm mb-8">
                      The following addresses will be used on the checkout page
                      by default.
                    </p>

                    {/* Show all addresses in a list */}
                    <div className="space-y-6 mb-8">
                      {addresses.map((address) => (
                        <div key={address.id} className="border p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{address.name}</h3>
                              <p className="text-gray-600">{address.address}</p>
                              {address.city && (
                                <p className="text-gray-600">
                                  {address.city.name},{" "}
                                  {address.country_state?.name},{" "}
                                  {address.country?.name} - {address.zip_code}
                                </p>
                              )}
                              <p className="text-gray-600">
                                Phone: {address.phone}
                              </p>
                              <p className="text-gray-600">
                                Email: {address.email}
                              </p>
                              <div className="mt-2">
                                {address.default_billing === 1 && (
                                  <span className="inline-block bg-gray-100 px-2 py-1 text-xs font-manrope font-bold rounded mr-2">
                                    DEFAULT BILLING
                                  </span>
                                )}
                                {address.default_shipping === 1 && (
                                  <span className="inline-block bg-gray-100 px-2  font-manrope font-bold py-1 text-xs rounded">
                                    DEFAULT SHIPPING
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleEditClick(address)}
                              className="border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                            >
                              EDIT
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Address Button */}
                    <button
                      onClick={() => {
                        setEditingAddressId(null);
                        setEditFormData({
                          type: "billing",
                          default_billing: 0,
                          default_shipping: 0,
                        });
                        setShowForm(true);
                      }}
                      className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
                    >
                      ADD NEW ADDRESS
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 pt-8">
                    <h2 className="font-medium mb-6">
                      {editingAddressId
                        ? editFormData.default_billing
                          ? "Billing address"
                          : "Shipping address"
                        : "Add new address"}
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm mb-1">
                          FULL NAME <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={editFormData.name || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 p-2 h-10"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm mb-1">
                          STREET ADDRESS <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={editFormData.address || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 p-2 h-10 mb-2"
                          required
                          placeholder="House number and street name"
                        />
                        <input
                          type="text"
                          id="address_2"
                          name="address_2"
                          value={editFormData.address_2 || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 p-2 h-10"
                          placeholder="Apartment, suite, unit, etc. (optional)"
                        />
                      </div>{" "}
                      <select
                        id="country_id"
                        name="country_id"
                        value={editFormData.country_id?.toString() || ""}
                        onChange={handleCountryChange}
                        className="w-full border border-gray-300 p-2 h-10 appearance-none bg-white"
                        required
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option
                            key={country.id}
                            value={country.id.toString()}
                          >
                            {country.name}
                          </option>
                        ))}
                      </select>
                      <select
                        id="state_id"
                        name="state_id"
                        value={editFormData.state_id?.toString() || ""}
                        onChange={handleStateChange}
                        className="w-full border border-gray-300 p-2 h-10 appearance-none bg-white"
                        required
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.id} value={state.id.toString()}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      <select
                        id="city_id"
                        name="city_id"
                        value={editFormData.city_id?.toString() || ""}
                        onChange={handleCityChange}
                        className="w-full border border-gray-300 p-2 h-10 appearance-none bg-white"
                        required
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id.toString()}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      <div>
                        <label
                          htmlFor="zip_code"
                          className="block text-sm mb-1"
                        >
                          PIN CODE <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="zip_code"
                          name="zip_code"
                          value={editFormData.zip_code || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 p-2 h-10"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm mb-1">
                          PHONE <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={editFormData.phone || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 p-2 h-10"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm mb-1">
                          EMAIL ADDRESS <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={editFormData.email || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 p-2 h-10"
                          required
                        />
                      </div>
                      <div className="pt-4 flex space-x-4">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="border border-gray-300 px-8 py-3 text-sm font-medium hover:bg-gray-50"
                        >
                          CANCEL
                        </button>
                        <button
                          type="submit"
                          className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800"
                        >
                          SAVE ADDRESS
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
          <div className="mb-8   lg:col-span-1">
            <ProfileNavbar />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(AddressPage, {
  redirectTo: "/sign-in",
  requireAuth: true,
  authMessage: "Please sign in to access your addresses",
});
