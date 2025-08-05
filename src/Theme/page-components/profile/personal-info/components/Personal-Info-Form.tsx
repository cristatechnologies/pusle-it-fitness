// app/profile/personal-info/_components/PersonalInfoForm.tsx
"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import {
  fetchStatesByCountry,
  fetchCitiesByState,
} from "@/services/fetch-country-fetch-state";
import toast from "react-hot-toast";
import { PersonInfo, Country, State, City } from "@/Theme/types/profile";

interface PersonalInfoFormProps {
  profileInfo: {
    personInfo: PersonInfo;
    countries: Country[];
    defaultProfile: {
      image: string;
    };
    states?: State[];
    cities?: City[];
  };
  onUpdate: (formData: FormData) => Promise<void>;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  profileInfo,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Partial<PersonInfo>>({
    name: profileInfo.personInfo.name || "",
    email: profileInfo.personInfo.email || "",
    phone: profileInfo.personInfo.phone || "",
    country_id: profileInfo.personInfo.country_id || 0,
    state_id: profileInfo.personInfo.state_id || 0,
    city_id: profileInfo.personInfo.city_id || null,
    zip_code: profileInfo.personInfo.zip_code || "",
    address: profileInfo.personInfo.address || "",
  });

  const [states, setStates] = useState<State[]>(profileInfo.states || []);
  const [cities, setCities] = useState<City[]>(profileInfo.cities || []);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [formImg, setFormImg] = useState<File | null>(null);
  const profileImgInput = useRef<HTMLInputElement>(null);

  // Dropdown visibility states
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountrySelect = async (country: Country) => {
    setFormData((prev) => ({
      ...prev,
      country_id: country.id,
      state_id: 0,
      city_id: null,
    }));
    setShowCountryDropdown(false);

    try {
      const fetchedStates = await fetchStatesByCountry(country.id);
      setStates(fetchedStates);
      setCities([]);
      
    } catch (error) {
      toast.error("Failed to load states");
      console.log(error)
    }
  };

  const handleStateSelect = async (state: State) => {
    setFormData((prev) => ({
      ...prev,
      state_id: state.id,
      city_id: null,
    }));
    setShowStateDropdown(false);

    try {
      const fetchedCities = await fetchCitiesByState(state.id);
      setCities(fetchedCities);

      
    } catch (error) {
      console.log(error)
      toast.error("Failed to load cities");
    }
  };

  const handleCitySelect = (city: City) => {
    setFormData((prev) => ({ ...prev, city_id: city.id }));
    setShowCityDropdown(false);
  };

  const browseProfileImg = () => {
    if (profileImgInput.current) {
      profileImgInput.current.click();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImg(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setFormImg(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();

      // Append all fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataObj.append(key, value.toString());
        }
      });

      if (formImg) {
        formDataObj.append("image", formImg);
      }

      await onUpdate(formDataObj);
      toast.success("Profile updated successfully");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrors(error.response?.data?.errors || { general: "Update failed" });
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  // Get display names for selected values
  const getSelectedCountryName = () => {
    const country = profileInfo.countries.find(
      (c) => c.id === formData.country_id
    );
    return country ? country.name : "Select Country";
  };

  const getSelectedStateName = () => {
    const state = states.find((s) => s.id === formData.state_id);
    return state ? state.name : "Select State";
  };

  const getSelectedCityName = () => {
    const city = cities.find((c) => c.id === formData.city_id);
    return city ? city.name : "Select City";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex lg:flex-row flex-col-reverse gap-8">
        {/* Form Section */}
        <div className="lg:w-[570px] w-full">
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-8">
              <label className="input-label mb-2 block text-gray-500 text-sm">
                Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData?.name}
                onChange={handleInputChange}
                placeholder="Name"
                className={`w-full border border-gray-300 px-4 h-[50px] rounded focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors?.name ? "border-red-500" : ""
                }`}
              />
              {errors?.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email and Phone Fields */}
            <div className="md:flex gap-5 mb-8">
              <div className="md:w-1/2">
                <p className="input-label mb-2 text-gray-500 text-sm">
                  Email
                  <span className="text-yellow-500 text-xs ml-1">
                    (Read Only)
                  </span>
                </p>
                <div className="w-full border border-yellow-500 px-6 h-[50px] bg-yellow-50 text-dark-gray flex items-center cursor-not-allowed rounded">
                  {formData.email}
                </div>
              </div>

              <div className="md:w-1/2 relative">
                <label className="input-label mb-2 block text-gray-500 text-sm">
                  Phone Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className={`w-full border border-gray-300 px-4 h-[50px] rounded focus:outline-none focus:ring-1 focus:ring-primary ${
                    errors?.phone ? "border-red-500" : ""
                  }`}
                />
                {errors?.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Location Fields */}
            <div className="md:flex gap-5 mb-6">
              <div className="md:w-1/2 mb-6 md:mb-0 relative">
                <label className="input-label mb-2 block text-gray-500 text-sm">
                  Country
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div
                  className="w-full border border-gray-300 px-4 h-[50px] flex items-center rounded cursor-pointer"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                >
                  {getSelectedCountryName()}
                </div>
                {showCountryDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                    {profileInfo.countries.map((country) => (
                      <div
                        key={country.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCountrySelect(country)}
                      >
                        {country.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:w-1/2 mb-6 md:mb-0 relative">
                <label className="input-label mb-2 block text-gray-500 text-sm">
                  State
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div
                  className={`w-full border border-gray-300 px-4 h-[50px] flex items-center rounded ${
                    !formData.country_id
                      ? "cursor-not-allowed bg-gray-100"
                      : "cursor-pointer"
                  }`}
                  onClick={() =>
                    formData.country_id &&
                    setShowStateDropdown(!showStateDropdown)
                  }
                >
                  {getSelectedStateName()}
                </div>
                {showStateDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                    {states.length > 0 ? (
                      states.map((state) => (
                        <div
                          key={state.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleStateSelect(state)}
                        >
                          {state.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No states available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="md:flex gap-5 mb-6">
              <div className="md:w-1/2 relative">
                <label className="input-label mb-2 block text-gray-500 text-sm">
                  City
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div
                  className={`w-full border border-gray-300 px-4 h-[50px] flex items-center rounded ${
                    !formData.state_id
                      ? "cursor-not-allowed bg-gray-100"
                      : "cursor-pointer"
                  }`}
                  onClick={() =>
                    formData.state_id && setShowCityDropdown(!showCityDropdown)
                  }
                >
                  {getSelectedCityName()}
                </div>
                {showCityDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                    {cities.length > 0 ? (
                      cities.map((city) => (
                        <div
                          key={city.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No cities available
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="md:w-1/2">
                <label className="input-label mb-2 block text-gray-500 text-sm">
                  Zip Code
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  name="zip_code"
                  value={formData.zip_code || ""}
                  onChange={handleInputChange}
                  placeholder="123456"
                  className={`w-full border border-gray-300 px-4 h-[50px] rounded focus:outline-none focus:ring-1 focus:ring-primary ${
                    errors?.zip_code ? "border-red-500" : ""
                  }`}
                />
                {errors?.zip_code && (
                  <p className="text-red-500 text-xs mt-1">{errors.zip_code}</p>
                )}
              </div>
            </div>

            {/* Address Field */}
            <div className="mb-8">
              <label className="input-label mb-2 block text-gray-500 text-sm">
                Address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                placeholder="Your address here"
                className={`w-full border border-gray-300 px-4 h-[50px] rounded focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors?.address ? "border-red-500" : ""
                }`}
              />
              {errors?.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 items-center">
              <button
                type="button"
                className="text-red-500 text-sm font-semibold"
                onClick={() => {
                  // Reset form logic
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-40 h-[50px] bg-primary text-white rounded text-sm font-bold"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>

        {/* Profile Image Section */}
        <div className="flex-1">
          <div className="update-logo w-full mb-9">
            <h1 className="text-xl font-bold text-gray-800 flex items-center mb-2">
              Update Profile
            </h1>
            <p className="text-sm text-gray-500 mb-5">
              Profile of at least size
              <span className="ml-1 text-gray-800">300x300</span>
            </p>

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden relative">
                  <Image
                    fill
                    src={
                      profileImg ||
                      `${process.env.NEXT_PUBLIC_BASE_URL}${profileInfo.personInfo.image}`
                    }
                    alt="Profile"
                    className="object-cover"
                  />
                </div>
                <input
                  ref={profileImgInput}
                  onChange={handleImageChange}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={browseProfileImg}
                  className="w-8 h-8 bg-primary rounded-full absolute bottom-3 right-3 cursor-pointer flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
