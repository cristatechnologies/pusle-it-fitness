"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/services/authApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";


export default function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      toast.error("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the terms and conditions");
      setIsSubmitting(false);
      toast.error("You must agree to the terms and conditions");
      return;
    }

    try {
      await registerUser(
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        agreeTerms,
        phone
      );
      toast.success("Registration successful! Please sign in.");
      router.push("/sign-in");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorResponse = err.response?.data;
        if (errorResponse?.errors) {
          // Handle field-specific errors
          const errorMessages = Object.values(errorResponse.errors)
            .flat()
            .join("\n");
          toast.error(errorMessages);
          setError(errorMessages);
        } else if (errorResponse?.message) {
          // Handle general error message
          toast.error(errorResponse.message);
          setError(errorResponse.message);
        } else {
          toast.error("Registration failed. Please try again.");
          setError("Registration failed. Please try again.");
        }
      } else if (err instanceof Error) {
        toast.error(err.message || "Registration failed. Please try again.");
        setError(err.message || "Registration failed. Please try again.");
      } else {
        toast.error("Registration failed. Please try again.");
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4 font-manrope" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium">
            FIRST NAME <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            className="w-full border border-gray-300 p-2.5 h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium">
            LAST NAME <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            className="w-full border border-gray-300 p-2.5 h-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            EMAIL ADDRESS <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-gray-300 p-2.5 h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium">
            PHONE NUMBER
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 p-2.5 h-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            PASSWORD <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full border border-gray-300 p-2.5 h-12"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center border border-gray-300 border-l-0"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium"
          >
            CONFIRM PASSWORD <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              className="w-full border border-gray-300 p-2.5 h-12"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center border border-gray-300 border-l-0"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-start pt-2">
        <div className="flex items-center h-5">
          <input
            id="agreeTerms"
            name="agreeTerms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
            required
          />
        </div>
        <label htmlFor="agreeTerms" className="ms-2 text-sm text-gray-500">
          I agree to the terms and conditions{" "}
          <span className="text-red-500">*</span>
        </label>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <button
        type="submit"
        disabled={isSubmitting || !agreeTerms}
        className={`w-full bg-amber-600 text-white py-3 font-medium hover:bg-amber-700 transition-colors ${
          isSubmitting || !agreeTerms ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting ? "REGISTERING..." : "REGISTER"}
      </button>
    </form>
  );
}
