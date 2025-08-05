// /MaintenanceModeGuard.tsx
"use client"


import { useAppSelector } from "@/lib/redux/hook";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import MaintenancePage from "@/app/maintenance/page";
interface MaintenanceModeGuardProps {
  children: React.ReactNode;
}

export const MaintenanceModeGuard = ({
  children,
}: MaintenanceModeGuardProps) => {
  const pathname = usePathname(); // ✅ Get the current pathname
  const router = useRouter();
  const maintenanceMode = useAppSelector(
    (state) => state.website.data?.maintainance
  );
  const isInitialized = useAppSelector(
    (state) => state.website.status === "succeeded"
  );

  useEffect(() => {
    if (
      isInitialized &&
      maintenanceMode?.status === 1 &&
      pathname !== "/maintenance"
    ) {
      router.replace("/maintenance");
    }
  }, [maintenanceMode, isInitialized, router]);

  if (!isInitialized) {
    // Show loading state or null while checking
    return null;
  }

  if (maintenanceMode?.status === 1 && pathname !== "/maintenance") {
    // Return maintenance page when maintenance mode is active
    return <MaintenancePage />;
  }

  return <>{children}</>;
};

// Higher-order component version
export const withMaintenanceModeGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ComponentWithMaintenanceModeGuard = (props: P) => (
    <MaintenanceModeGuard>
      <WrappedComponent {...props} />
    </MaintenanceModeGuard>
  );

  return ComponentWithMaintenanceModeGuard;
};
