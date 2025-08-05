"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useCart } from "@/context/Cart-Context";
import Image from "next/image";
import { useAppSelector } from "@/lib/redux/hook";
import { CartProduct } from "@/lib/redux/features/cart/types";
import { JSX } from "react";
import { settings } from "@/lib/redux/features/website/settings";
import { removeCartItem } from "@/services/cart";
import Link from "next/link";

const CartItemSkeleton = () => (
  <div className="flex items-center p-2">
    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
    <div className="flex-grow ml-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
    </div>
  </div>
);

export default function CartDrawer(): JSX.Element {
  const { isCartOpen, closeCart } = useCart();
  const cartData = useAppSelector((state) => state.cart.data);
  const cartStatus = useAppSelector((state) => state.cart.status);
  const cartProducts = cartData?.cartProducts || [];
  const { currency_icon } = settings();

  // Calculate subtotal considering variant prices
  const subtotal = cartProducts.reduce((sum, item) => {
    const basePrice = item.product.offer_price || item.product.price;
    const variantPrice = item.variants.reduce(
      (vSum, variant) => vSum + variant.variant_item.price,
      0
    );
    return sum + (basePrice + variantPrice) * item.qty;
  }, 0);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      if (isCartOpen && target.classList.contains("cart-overlay")) {
        closeCart();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen, closeCart]);

  // Initial state for animation
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Function to get brand name from product
  const getBrandName = (product: CartProduct["product"]): string => {
    return product.short_name || "";
  };

  // Function to handle item removal
  const handleRemoveItem = async (itemId: number) => {
    await removeCartItem(itemId);
  };

  // Function to get display price (product price + variant prices)
  const getDisplayPrice = (item: CartProduct): number => {
    const basePrice = item.product.offer_price || item.product.price;
    const variantPrice = item.variants.reduce(
      (sum, variant) => sum + variant.variant_item.price,
      0
    );
    return basePrice + variantPrice;
  };

  return (
    <>
      {/* Cart Overlay */}
      {isCartOpen && (
        <div className="font-manrope fixed inset-0 bg-white/40  z-[9999] cart-overlay">
          {/* Cart Drawer */}
          <div
            className="fixed top-0 right-0 h-screen w-full sm:w-[400px] md:w-[350px] max-w-[100vw] bg-white z-50 flex flex-col"
            style={{
              transform: isCartOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeCart}
              className="absolute cursor-pointer top-4 right-4 text-black z-10"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>

            {/* Cart Header */}
            <div className="px-4 sm:px-6 pt-4 pb-2 border-b">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
              {cartStatus === "loading" ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, index) => (
                    <CartItemSkeleton key={`skeleton-${index}`} />
                  ))}
                </div>
              ) : cartProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-gray-500">
                  <p className="text-lg font-medium">No products added</p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {cartProducts.map((item: CartProduct) => (
                    <div
                      key={item.id}
                      className="flex items-start group relative hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                      <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded overflow-hidden relative mr-3 sm:mr-4">
                        <Image
                          src={
                            `${process.env.NEXT_PUBLIC_BASE_URL}${item.product.thumb_image}` ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          alt={item.product.name}
                          fill
                          sizes="(max-width: 640px) 56px, 64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0 pr-6">
                        <h3 className="text-sm font-medium leading-tight truncate">
                          {item.product.short_name}
                        </h3>
                        <p className="text-xs mt-1 text-gray-500 uppercase">
                          {getBrandName(item.product)}
                        </p>

                        {/* Display variants if they exist */}
                        {item.variants.length > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            {item.variants.map((variant) => (
                              <div key={variant.id} className="truncate">
                                {variant.variant_item.product_variant_name}:{" "}
                                {variant.variant_item.name}
                              </div>
                            ))}
                          </div>
                        )}

                        <p className="text-sm mt-2 font-medium">
                          {item.qty} × {currency_icon}
                          {getDisplayPrice(item).toFixed(2)}
                        </p>
                      </div>
                      {/* Remove button */}
                      <button
                        className="absolute cursor-pointer right-2 top-2 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500 p-1"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer - Fixed at bottom */}
            <div className="border-t mt-auto">
              <div className="px-4 sm:px-6 py-4">
                {cartStatus === "loading" ? (
                  <>
                    <div className="flex justify-between mb-4">
                      <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/6 animate-pulse"></div>
                    </div>
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="py-3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="py-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between mb-4">
                      <span className="font-medium uppercase text-sm sm:text-base">
                        Subtotal
                      </span>
                      <span className="font-medium text-sm sm:text-base">
                        {currency_icon}
                        {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
                      <Link
                        href="/cart"
                        className="block w-full py-3 bg-[var(--primary-color)] text-[var(--primary-text-color)] font-medium text-xs sm:text-sm uppercase hover:bg-[var(--hover-color)] transition-colors border-[var(--secondary-color)] border text-center rounded"
                        onClick={closeCart}
                      >
                        VIEW CART
                      </Link>
                      <Link
                        href="/checkout"
                        className="block w-full py-3 bg-[var(--secondary-color)] text-[var(--secondary-text-color)] font-medium text-xs sm:text-sm uppercase hover:bg-[var(--hover-color)] transition-colors text-center rounded"
                        onClick={closeCart}
                      >
                        CHECKOUT
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
