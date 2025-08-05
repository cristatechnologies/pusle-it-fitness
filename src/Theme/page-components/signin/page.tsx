"use client";

import Link from "next/link";
import SigninForm from "./Signin-Form";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import { useAppDispatch } from "@/lib/redux/hook";
import { fetchWishlist } from "@/lib/redux/features/wishlist/thunks";



export default function SigninPage() {
  const dispatch = useAppDispatch();
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Sign-in", href: "/sign-in" },
  ];

  const handleLoginSuccess = () => {
    // This will be called after successful login
    dispatch(fetchWishlist());
  };
  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="max-w-lg w-full mx-auto py-12 px-4">
        <h1 className="text-center text-lg font-semibold mb-8 font-manrope">
          LOGIN
        </h1>
        <SigninForm onSuccess={handleLoginSuccess} />
        <div className="text-center mt-4 font-manrope">
          <span className="text-sm">Not A Member? </span>
          <Link href="/sign-up" className="text-sm text-green-700 font-medium">
            Register
          </Link>
        </div>
      </div>
    </>
  );
}
