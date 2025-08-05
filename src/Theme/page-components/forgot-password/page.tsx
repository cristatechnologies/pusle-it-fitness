"use client";
// src/Theme/Page-components/forgot-password/ForgotPasswordForm.tsx

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { sendOtp, resetPassword } from "@/services/authApi";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "reset">("email");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>(null);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendOtp(email);
      toast.success("OTP sent to your email");
      setStep("reset");
      setErrors(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrors(error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(email, otp, newPassword, confirmPassword);
      toast.success("Password reset successfully");
      router.push("/sign-in");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrors(error.response?.data);
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="space-y-8 w-full max-w-xl mx-auto"
      onSubmit={step === "email" ? handleSendOtp : handleResetPassword}
    >
      <h1 className="text-center text-lg font-semibold mb-8 font-manrope">
        {step === "email" ? "FORGOT PASSWORD" : "RESET PASSWORD"}
      </h1>

      {step === "email" ? (
        <div className="space-y-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium font-manrope"
          >
            EMAIL ADDRESS <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-gray-300 p-2.5 h-12 font-manrope"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors?.errors?.email && (
            <p className="text-red-500 text-sm">{errors.errors.email[0]}</p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-6">
            <label
              htmlFor="otp"
              className="block text-sm font-medium font-manrope"
            >
              OTP <span className="text-red-500">*</span>
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              className="w-full border border-gray-300 p-2.5 h-12 font-manrope"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {errors?.errors?.otp && (
              <p className="text-red-500 text-sm">{errors.errors.otp[0]}</p>
            )}

            <label
              htmlFor="newPassword"
              className="block text-sm font-medium font-manrope"
            >
              NEW PASSWORD <span className="text-red-500">*</span>
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              className="w-full border border-gray-300 p-2.5 h-12 font-manrope"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errors?.errors?.password && (
              <p className="text-red-500 text-sm">
                {errors.errors.password[0]}
              </p>
            )}

            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium font-manrope"
            >
              CONFIRM PASSWORD <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full border border-gray-300 p-2.5 h-12 font-manrope"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={
          loading ||
          (step === "email" ? !email : !otp || !newPassword || !confirmPassword)
        }
        className="w-full bg-[#c69657] text-white py-3 text-sm hover:bg-black transition-colors font-manrope flex justify-center items-center disabled:bg-opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
        ) : null}
        {step === "email" ? "SEND OTP" : "RESET PASSWORD"}
      </button>

      <div className="text-center mt-4 font-manrope">
        {step === "email" ? (
          <>
            <span className="text-sm">Remember your password? </span>
            <Link
              href="/sign-in"
              className="text-sm text-green-700 font-medium"
            >
              Sign in
            </Link>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setStep("email")}
            className="text-sm text-amber-700 font-medium"
          >
            Back to email entry
          </button>
        )}
      </div>
    </form>
  );
}
