// app/sign-in/Signin-Form.tsx
"use client";

import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginUser } from "@/services/authApi";
import { Eye, EyeOff } from "lucide-react";


interface SigninFormProps {
  onSuccess?: () => void;
}

export default function SigninForm({ onSuccess }: SigninFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginUser(email, password, rememberMe);
      toast.success("Login successful");

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to either the saved path or home
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (
            error.response.data.notification ===
            "Please verify your acount. If you didn't get OTP, please resend your OTP and verify"
          ) {
            toast.custom(
              <div className="bg-white shadow-md rounded p-4 border border-gray-200 max-w-sm">
                <p className="text-xs text-gray-800">
                  Please verify your account. If you didn `&apos;` t get an OTP,
                  please resend your OTP and verify.
                </p>
                <button
                  type="button"
                  onClick={() => router.push(`/verify-you?email=${email}`)}
                  className="text-sm text-blue-500 font-bold mt-2"
                >
                  Send OTP
                </button>
              </div>
            );
          } else {
            toast.error(
              error.response.data.message || "Invalid login credentials"
            );
          }
        } else {
          toast.error("Network error. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-8 w-full max-w-xl mx-auto" onSubmit={handleSubmit}>
      {/* Rest of the form remains exactly the same */}
      <div className="space-y-6">
        <label
          htmlFor="username"
          className="block text-sm font-medium font-manrope"
        >
          USERNAME OR EMAIL ADDRESS <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="text"
          required
          className="w-full border border-gray-300 p-2.5 h-12 font-manrope"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium font-manrope"
        >
          PASSWORD <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full border border-gray-300 p-2.5 h-12 font-manrope"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 border-gray-300"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember-me" className="ml-2 text-xs font-manrope">
            REMEMBER ME
          </label>
        </div>
        <Link href="/forgot-password" className="text-xs text-amber-700">
          Lost Your Password?
        </Link>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#c69657] text-white py-3 text-sm hover:bg-black transition-colors font-manrope flex justify-center items-center"
      >
        {loading ? (
          <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
        ) : null}
        LOG IN
      </button>
    </form>
  );
}
