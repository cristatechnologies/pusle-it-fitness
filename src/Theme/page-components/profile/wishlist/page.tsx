// Theme/page-component/profile/wishlist/page.tsx
"use client";

import { useEffect } from "react";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import ProfileNavbar from "../navbar";
import { withAuth } from "../../../../../middleware/isAuth";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hook";
import { fetchWishlist,removeFromWishlist } from "@/lib/redux/features/wishlist/thunks";
import { settings } from "@/lib/redux/features/website/settings";
import { Heart, X, Plus, Grid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";


const ProfileWishlistPage = () => {
  const dispatch = useAppDispatch();
  const { currency_icon } = settings();
  const {
    data: wishlist,
    status,
    error,
  } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = async (Id: number) => {
    try {
     await dispatch(removeFromWishlist(Id)).unwrap();
      toast.success("Item removed from wishlist");
      // No need to manually refresh as the thunk already updates the state
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove item"
      );
    }
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile/dashboard" },
    { label: "Wishlist", href: "/profile/wishlist" },
  ];

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        Error: {error || "Failed to load wishlist"}
      </div>
    );
  }

  // Safely check for empty wishlist
  const wishlistItems = wishlist?.wishlists?.data || [];

  if (wishlistItems.length === 0) {
    return (
      <>
        <BreadcrumbNav items={breadcrumbItems} />
        <div className="font-manrope container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">MY WISHLIST</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg shadow-sm">
                <div className="relative">
                  <Heart className="w-20 h-20 text-gray-400" strokeWidth={1} />
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    0
                  </span>
                </div>

                <h2 className="mt-6 text-xl font-medium text-gray-800">
                  Your Wishlist Is Currently Empty
                </h2>

                <p className="mt-2 text-gray-600 text-sm">
                  Click the{" "}
                  <Heart className="inline-block w-4 h-4 mx-1 text-gray-500" />{" "}
                  icons to add products
                </p>

                <Link
                  href="/shop"
                  className="mt-6 px-10 py-4 border border-black text-black text-sm font-semibold hover:bg-black hover:text-white transition"
                >
                  RETURN TO SHOP
                </Link>
              </div>
            </div>
            <div className="lg:col-span-1">
              <ProfileNavbar />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="font-manrope container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">MY WISHLIST</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PRODUCT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PRICE
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STATUS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {wishlistItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-20 bg-gray-100 flex items-center justify-center overflow-hidden">
                              <Image
                                src={
                                  `${
                                    process.env.NEXT_PUBLIC_BASE_URL ||
                                    "/placeholder.svg"
                                  }${item.product.thumb_image}` ||
                                  "/placeholder.svg?height=64&width=64"
                                }
                                alt={item.product.name}
                                width={64}
                                height={80}
                                className="object-cover"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFromWishlist(item.id);
                                }}
                                className="cursor-pointer absolute top-2 left-2 bg-white text-black rounded-full p-1 opacity-0 hover:opacity-100 transition-all duration-200 hover:scale-110 hover:shadow-sm"
                                aria-label="Remove from wishlist"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="font-medium text-sm">
                              {item.product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.product.offer_price ? (
                            <div className="flex flex-col">
                              <span className="font-[550]">
                                {currency_icon}
                                {item.product.offer_price.toFixed(2)}
                              </span>
                              <span className="line-through text-gray-400 text-sm">
                                {currency_icon}
                                {item.product.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-semibold">
                              {currency_icon}
                              {item.product.price.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.product.qty > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.product.qty > 0
                              ? item.product.qty > 10
                                ? "IN STOCK"
                                : `${item.product.qty} IN STOCK`
                              : "OUT OF STOCK"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="border border-gray-300 px-4 py-2 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors">
                            {item.product.qty > 0 ? (
                              <>
                                <Plus className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  ADD TO CART
                                </span>
                              </>
                            ) : (
                              <>
                                <Grid className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  VIEW PRODUCT
                                </span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

export default withAuth(ProfileWishlistPage, {
  redirectTo: "/sign-in",
  requireAuth: true,
  authMessage: "Please sign in to view your wishlist",
});
