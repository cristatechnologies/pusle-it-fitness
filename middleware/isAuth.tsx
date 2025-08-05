"use client";

/* eslint-disable react/display-name */
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import auth from "@/lib/utils/auth";
import { ReactNode } from "react";
import toast from "react-hot-toast";

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  authMessage?: string; // Optional custom message
}

export const AuthGuard = ({
  children,
  redirectTo = "/sign-in",
  requireAuth = true,
  authMessage = "You need to be signed in to access this page", // Default message
}: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authData = auth();
      const isAuthenticated =
        authData && typeof authData === "object" && "access_token" in authData;

      if (requireAuth && !isAuthenticated) {
        toast.error(authMessage); // Show error toast
        router.push(
          `${redirectTo}?from=${encodeURIComponent(pathname || "/")}`
        );
      } else if (!requireAuth && isAuthenticated) {
        router.push("/");
      } else {
        setIsAuthorized(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router, redirectTo, requireAuth, pathname, authMessage]);

  if (isLoading) {
    return null; // or your custom loading component
  }

  return isAuthorized ? <>{children}</> : null;
};

// Higher Order Component version with TypeScript improvements
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    redirectTo?: string;
    requireAuth?: boolean;
    authMessage?: string;
  }
) => {
  return (props: P) => (
    <AuthGuard
      redirectTo={options?.redirectTo}
      requireAuth={options?.requireAuth}
      authMessage={options?.authMessage}
    >
      <WrappedComponent {...props} />
    </AuthGuard>
  );
};


export const checkAuthBeforeAction = (action: () => void, redirectTo = "/sign-in") => {
  const authData = auth();
  const isAuthenticated =
    authData && typeof authData === "object" && "access_token" in authData;

  if (!isAuthenticated) {
    toast.error("You need to be signed in to add items to cart");
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      window.location.href = `${redirectTo}?from=${encodeURIComponent(pathname || "/")}`;
    }
    return false;
  }
  action();
  return true;
};
