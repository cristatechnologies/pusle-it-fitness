"use client";

import React from "react";
import Image from "next/image";
import { Heart, Eye, Plus, Minus, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/redux/features/homepage/types";
import { settings } from "@/lib/redux/features/website/settings";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hook";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/lib/redux/store";
import toast from "react-hot-toast";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/redux/features/wishlist/thunks";
import { checkAuthBeforeAction } from "../../../../../middleware/isAuth";
import { addToCart } from "@/services/cart";
import { isProductInCart } from "@/lib/redux/features/cart/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/Theme/shadcn/components/ui/drawer";
import { Button } from "@/Theme/shadcn/components/ui/button";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  categorySlug?: string;
}

export default function ProductCard({
  product,
  onQuickView,
  categorySlug,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedVariantItems, setSelectedVariantItems] = React.useState<
    Record<number, number>
  >({});
  const [variantError, setVariantError] = React.useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { currency_icon } = settings();
  const cart = useAppSelector((state) => state.cart);
  const catalogStatus = useAppSelector(
    (state) => state.website.data?.catalog_mode?.status
  );
  const showPrice = useAppSelector(
    (state) => state.website.data?.catalog_mode?.show_price
  );

  // Get wishlist data from store
  const wishlist = useAppSelector(
    (state) => state.wishlist.data?.wishlists?.data
  );
  // Check if current product exists in wishlist
  const wishlistItem = wishlist?.find((item) => item.product_id === product.id);
  const isInWishlist = !!wishlistItem;

  const activeVariants = product.active_variants || [];
  const hasVariants = activeVariants.length > 0;
  const selectedVariantItemIds = Object.values(selectedVariantItems);
  const isInCart = isProductInCart(cart, product.id, selectedVariantItemIds);

  const getDisplayPrice = () => {
    if (hasVariants && activeVariants[0]?.active_variant_items?.length > 0) {
      const firstVariantItem = activeVariants[0].active_variant_items[0];
      return {
        price: firstVariantItem.price,
        offer_price: product.offer_price
          ? firstVariantItem.price + product.offer_price
          : null,
      };
    }
    return {
      price: product.price,
      offer_price: product.offer_price,
    };
  };

  const displayPrice = getDisplayPrice();

  const handleWishlistAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    checkAuthBeforeAction(async () => {
      setIsWishlistLoading(true);
      try {
        if (isInWishlist && wishlistItem) {
          await dispatch(removeFromWishlist(wishlistItem.id)).unwrap();
          toast.success("Removed from wishlist");
        } else {
          await dispatch(addToWishlist(product.id)).unwrap();
          toast.success("Added to wishlist");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsWishlistLoading(false);
      }
    });
  };

  const handleAddToCart = async () => {
    if (hasVariants) {
      const missingVariants = activeVariants.filter(
        (variant) => !selectedVariantItems[variant.id]
      );

      if (missingVariants.length > 0) {
        setVariantError(
          `Please select ${missingVariants.map((v) => v.name).join(" and ")}`
        );
        return;
      }
    }

    setVariantError(null);

    const variantData = hasVariants
      ? Object.entries(selectedVariantItems).map(([variantId, itemId]) => ({
          variantId: Number(variantId),
          itemId: Number(itemId),
        }))
      : [];

    addToCart(product.id, quantity, variantData);
  };

  const handleVariantItemSelect = (variantId: number, itemId: number) => {
    setSelectedVariantItems((prev) => ({
      ...prev,
      [variantId]: itemId,
    }));
  };

  const handleDirectAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    checkAuthBeforeAction(async () => await handleAddToCart());
  };

  return (
    <div
      className="font-manrope w-full transition-all duration-300 !font-[500] relative bg-white cursor-pointer"
      style={{
        border: isHovered ? "1px solid black" : "1px solid #eaeaea",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist button - always visible if product is in wishlist, or on hover */}
      {(isHovered || isInWishlist) && !catalogStatus && (
        <button
          className={`absolute top-2 right-2 z-10 p-1 rounded-full transition-colors duration-200`}
          onClick={handleWishlistAction}
          disabled={isWishlistLoading}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className="h-5 w-5"
            fill={isInWishlist ? "currentColor" : "none"}
          />
        </button>
      )}

    
        {/* Product image container */}
        <div className="relative p-4 flex items-center justify-center">
          <div className="relative w-full sm:w-full md:w-full lg:w-full aspect-[1/1]">
          <Link href={`/shop/${categorySlug}/${product.slug}`}>
            <Image
              src={
                `${process.env.NEXT_PUBLIC_BASE_URL}${product.thumb_image}` ||
                "/placeholder.svg"
              }
              alt={product.short_name}
              fill
              className="object-contain"
            />
          </Link>
          </div>

          {/* Quick view and Add to cart buttons - visible on hover */}
          {isHovered && (
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
              <button
                className="w-full py-2 flex items-center justify-center gap-2 bg-white hover:bg-black hover:text-white text-black text-sm border border-black transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
              >
                <Eye className="h-4 w-4" />
                <span className="font-manrope font-[500] text-[14px]">
                  QUICK VIEW
                </span>
              </button>
              {!catalogStatus ? (
                hasVariants ? (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <button className="w-full py-2 flex items-center justify-center gap-2 bg-white hover:bg-black hover:text-white text-black text-sm border border-black transition-colors duration-200">
                        {isInCart ? (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            <span className="font-manrope font-[500] text-[14px]">
                              GO TO CART
                            </span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            <span className="font-manrope font-[500] text-[14px]">
                              ADD TO CART
                            </span>
                          </>
                        )}
                      </button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[80vh] overflow-y-auto">
                      <div className="mx-auto w-full max-w-md p-4">
                        <DrawerHeader>
                          <DrawerTitle className="text-center">
                            {product.name}
                          </DrawerTitle>
                        </DrawerHeader>

                        {/* Variant Selection */}
                        <div className="space-y-6">
                          {activeVariants.map((variant) => (
                            <div key={variant.id} className="space-y-3">
                              <h3 className="font-medium uppercase text-center">
                                {variant.name}
                              </h3>
                              <div className="flex flex-wrap justify-center gap-2">
                                {variant.active_variant_items.map((item) => (
                                  <button
                                    key={item.id}
                                    className={`px-4 py-2 border text-sm ${
                                      selectedVariantItems[variant.id] ===
                                      item.id
                                        ? "bg-black text-white"
                                        : "bg-white text-black"
                                    }`}
                                    onClick={() =>
                                      handleVariantItemSelect(
                                        variant.id,
                                        item.id
                                      )
                                    }
                                  >
                                    {item.name}
                                    {showPrice &&
                                      item.price > 0 &&
                                      ` (${currency_icon}${item.price})`}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                          {variantError && (
                            <div className="text-red-500 text-sm text-center">
                              {variantError}
                            </div>
                          )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center justify-center space-x-4 mt-6">
                          <div className="flex items-center border">
                            <button
                              className="px-3 py-2 cursor-pointer border-r"
                              onClick={() =>
                                setQuantity((prev) => Math.max(1, prev - 1))
                              }
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2">{quantity}</span>
                            <button
                              className="px-3 py-2 cursor-pointer border-l"
                              onClick={() => setQuantity((prev) => prev + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <DrawerFooter className="pt-6">
                          {isInCart ? (
                            <Link href="/cart" className="w-full">
                              <Button className="w-full">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                GO TO CART
                              </Button>
                            </Link>
                          ) : (
                            <Button onClick={handleAddToCart}>
                              ADD TO CART
                            </Button>
                          )}
                          <DrawerClose asChild>
                            <Button variant="outline">CANCEL</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </div>
                    </DrawerContent>
                  </Drawer>
                ) : isProductInCart(cart, product.id, []) ? (
                  <Link
                    href="/cart"
                    className="w-full py-2 flex items-center justify-center gap-2 bg-white hover:bg-black hover:text-white text-black text-sm border border-black transition-colors duration-200"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="font-manrope font-[500] text-[14px]">
                      GO TO CART
                    </span>
                  </Link>
                ) : (
                  <button
                    className="w-full py-2 flex items-center justify-center gap-2 bg-white hover:bg-black hover:text-white text-black text-sm border border-black transition-colors duration-200"
                    onClick={handleDirectAddToCart}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="font-manrope font-[500] text-[14px]">
                      ADD TO CART
                    </span>
                  </button>
                )
              ) : null}
            </div>
          )}
        </div>
        {/* Product details */}
        <div className="p-4 bg-[var(--primary-color)]">
        <Link href={`/shop/${categorySlug}/${product.slug}`}>
          <h3 className="font-manrope font-[500] hover:text-[var(--hover-color)] text-[14px] mb-2">
            {product.name}
          </h3>

          <p className="font-manrope font-[500] text-[14px] text-gray-600 mb-3 line-clamp-2">
            {product.short_description}
          </p>

          {product.averageRating && product.averageRating !== "0" && (
            <div className="flex items-center mb-2">
              <span className="text-xs">★</span>
              <span className="text-xs ml-1">{product.averageRating}</span>
            </div>
          )}

          {showPrice && (
            <div className="flex items-center gap-2">
              {displayPrice.offer_price ? (
                <>
                  <span className="font-medium text-base">
                    {currency_icon}
                    {displayPrice.offer_price}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {currency_icon}
                    {displayPrice.price}
                  </span>
                </>
              ) : (
                <span className="font-medium text-base">
                  {currency_icon}
                  {displayPrice.price}
                </span>
              )}
            </div>
          )}
      </Link>
        </div>
    </div>
  );
}
