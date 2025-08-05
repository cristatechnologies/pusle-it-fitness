// app/profile/personal-info/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/services/Auth-Token";
import { fetchProfileData } from "@/services/profileApi";
import PersonalInfoForm from "./components/Personal-Info-Form";
import toast from "react-hot-toast";
import { withAuth } from "../../../../../middleware/isAuth";
import Link from "next/link";
import { User, MapPin, Heart, Lock, Star, FileText } from "lucide-react";
import axios from "axios";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import {ProfileResponse } from "@/Theme/types/profile";
const PersonalInfoPage = () => {
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const user = getAuthToken();


  // interface PersonalInfoFormProps {
  //   profileInfo?: PersonInfo;
  //   countries: Country[];
  //   defaultProfileImage?: string;
  //   onUpdate: (formData: FormData) => Promise<void>;
  // }
  interface MenuItem {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    link: string;
  }

  const menuItems: MenuItem[] = [
    { title: "Personal Info", icon: User, link: "/profile/personal-info" },
    { title: "Orders", icon: FileText, link: "/profile/orders" },
    { title: "Wishlist", icon: Heart, link: "/profile/wishlist" },
    { title: "Address", icon: MapPin, link: "/profile/address" },
    { title: "Reviews", icon: Star, link: "/profile/reviews" },
    { title: "Change Password", icon: Lock, link: "/profile/change-password" },
  ];

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    const loadProfileData = async () => {
      try {
        const data = await fetchProfileData(user);
        setProfileData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load profile data"
        );
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user, router]);

  const handleUpdateProfile = async (formData: FormData) => {
    if (!user) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("Profile updated successfully");
        // Refresh profile data
        const updatedData = await fetchProfileData(user);
        setProfileData(updatedData);
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
        ? err.message
        : "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  if (!profileData) {
    return null;
  }
const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Profile", href: "/profile/dashboard" },
  { label: "Personal Information", href: "/profile/personal-info" },
];


  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="font-manrope container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">
          PERSONAL INFORMATION
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PersonalInfoForm
              profileInfo={{
                personInfo: profileData.personInfo,
                countries: profileData.countries || [],
                defaultProfile: {
                  image: profileData?.defaultProfile.image,
                },
                states: profileData.states,
                cities: profileData.cities,
              }}
              onUpdate={handleUpdateProfile}
            />
          </div>

          <div className="border rounded p-6">
            <h2 className="text-lg font-bold uppercase mb-4">Account Menu</h2>
            <nav>
              <ul className="space-y-3">
                {menuItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.link}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <item.icon className="h-5 w-5 text-gray-500" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(PersonalInfoPage, {
  redirectTo: "/sign-in",
  requireAuth: true,
  authMessage: "Please sign in to access your profile",
});
