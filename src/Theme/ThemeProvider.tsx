// theme/ThemeProvider.tsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import ThemeLayout from "./Layout";
import Header from "./Helpers/Header";
import Footer from "./Helpers/Footer";
import CartDrawer from "./Helpers/Cart-Drawer";
import { fetchCart } from "@/lib/redux/features/cart/thunk";




export default function ThemeProvider({
  children,

}: {
  children: React.ReactNode;
  isHomePage?: boolean;
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Only fetch cart data since website data is already available
    dispatch(fetchCart());
  }, [dispatch]);


  
  return (
    <ThemeLayout>
      <Header  />
      {children}
      <Footer />
      <CartDrawer />
    </ThemeLayout>
  );
}
