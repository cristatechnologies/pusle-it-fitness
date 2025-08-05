// app/profile/change-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import ProfileNavbar from "../navbar";
import { withAuth } from "../../../../../middleware/isAuth";
import { updatePassword } from "@/services/profileApi";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const ChangePasswordPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      toast.error("New passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await updatePassword(formData);
      toast.success(response.notification);
      setFormData({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      router.push("/profile/dashboard");
    } catch (error: unknown) {
      let errorMessage = "Failed to update password";
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { notification?: string } };
        };
        errorMessage = axiosError.response?.data?.notification || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile/dashboard" },
    { label: "Change Password", href: "/profile/change-password" },
  ];

  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="font-manrope container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">CHANGE PASSWORD</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm w-[80%] p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <label
                    htmlFor="current_password"
                    className="block text-xs font-manrope text-black mb-1"
                  >
                    CURRENT PASSWORD
                  </label>
                  <input
                    type={showPassword.current ? "text" : "password"}
                    id="current_password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-8 text-gray-500 hover:text-black"
                  >
                    {showPassword.current ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-xs font-manrope text-black mb-1"
                  >
                    NEW PASSWORD
                  </label>
                  <input
                    type={showPassword.new ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-8 text-gray-500 hover:text-black"
                  >
                    {showPassword.new ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <label
                    htmlFor="password_confirmation"
                    className="block text-xs font-manrope text-black mb-1"
                  >
                    CONFIRM NEW PASSWORD
                  </label>
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-8 text-gray-500 hover:text-black"
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="pt-2 w-[40%] mx-auto">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-black border border-black cursor-pointer hover:text-white py-3 px-4 hover:bg-black transition-colors disabled:bg-gray-400 disabled:border-gray-400 disabled:text-white"
                  >
                    {isLoading ? "UPDATING..." : "UPDATE PASSWORD"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <ProfileNavbar />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(ChangePasswordPage, {
  redirectTo: "/sign-in",
  requireAuth: true,
  authMessage: "Please sign in to change your password",
});
