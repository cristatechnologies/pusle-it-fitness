// app/profile/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import DashboardStats from "./components/Dashboard-Stats";
import ProfileInfo from "./components/Profile-Info";
import { fetchDashboardData } from "@/services/profileApi";
import toast from "react-hot-toast";
import { withAuth } from "../../../../../middleware/isAuth";

import { DashboardData } from "@/Theme/types/profile";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import ProfileNavbar from "../navbar";

interface DashboardState {
  totalOrder: number;
  completeOrder: number;
  pendingOrder: number;
  declinedOrder: number;
  personInfo: DashboardData["personInfo"] | null;
}




const DashboardPage = () => {
 const [dashboardData, setDashboardData] = useState<DashboardState>({
   totalOrder: 0,
   completeOrder: 0,
   pendingOrder: 0,
   declinedOrder: 0,
   personInfo: null,
 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
          setDashboardData({
            totalOrder: data.totalOrder,
            completeOrder: data.completeOrder,
            pendingOrder: data.pendingOrder,
            declinedOrder: data.declinedOrder,
            personInfo: data.personInfo,
          });
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.log("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Profile", href: "/profile/dashboard" },
 
];






  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="font-manrope container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">DASHBOARD</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DashboardStats
              totalOrder={dashboardData.totalOrder}
              completeOrder={dashboardData.completeOrder}
              pendingOrder={dashboardData.pendingOrder}
              declinedOrder={dashboardData.declinedOrder}
            />
          </div>

          <div className="lg:col-span-1">
            <ProfileInfo personInfo={dashboardData.personInfo} />
           <ProfileNavbar />
          </div>
         
        </div>
      </div>
    </>
  );
}

export default withAuth(DashboardPage, {
  redirectTo: "/sign-in",
  requireAuth: true,
  authMessage: "Please sign in to access your dashboard"
});
