"use client";

import Image from "next/image";
import { Heart, Eye, Plus, Minus, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/redux/features/homepage/types";
import { settings } from "@/lib/redux/features/website/settings";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hook";
import { useState } from "react";
import { addToCart } from "@/services/cart";
import { Button } from "@/Theme/shadcn/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/Theme/shadcn/components/ui/drawer";
import { isProductInCart } from "@/lib/redux/features/cart/utils";
import { checkAuthBeforeAction } from "../../../middleware/isAuth";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/lib/redux/store";
import { fetchWishlist } from "@/lib/redux/features/wishlist/thunks";
import toast from "react-hot-toast";
import { addToWishlist,removeFromWishlist } from "@/lib/redux/features/wishlist/thunks";
interface ProductCardProps {
  product: Product;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onQuickView: () => void;
  categorySlug: string;
}

export default function ProductCardSlider({
  product,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onQuickView,
  categorySlug,
}: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  
  const wishlist = useAppSelector(
    (state) => state?.wishlist?.data?.wishlists?.data
  );
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const isInWishlist = wishlist?.some((item) => item.product_id === product.id);

  const handleWishlistAction = async () => {
    if (!product) return;

    checkAuthBeforeAction(async () => {
      setIsWishlistLoading(true);

      try {
        if (isInWishlist) {
          // Find the wishlist item to get its ID
          const wishlistItem = wishlist?.find(
            (item) => item.product_id === product.id
          );
          console.log("wishlistItem", wishlistItem);
          if (wishlistItem) {
            await dispatch(removeFromWishlist(wishlistItem.id)).unwrap();
            toast.success("Removed from wishlist");
          }
        } else {
          await dispatch(addToWishlist(product.id)).unwrap();
          toast.success("Added to wishlist");
          // Refresh the wishlist after adding
          await dispatch(fetchWishlist());
        }
      } catch (err) {
        toast.error("Failed to update wishlist");
        console.log(err);
      } finally {
        setIsWishlistLoading(false);
      }
    });
  };




  

  console.log("product-card-slider",product)
  const catalogStatus = useAppSelector(
    (state) => state.website.data?.catalog_mode?.status
  );
  const showPrice = useAppSelector(
    (state) => state.website.data?.catalog_mode?.show_price
  );
  const cart = useAppSelector((state) => state.cart);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantItems, setSelectedVariantItems] = useState<
    Record<number, number>
  >({});
  const [variantError, setVariantError] = useState<string | null>(null);
  const { currency_icon } = settings();

  const activeVariants = product.active_variants || [];
  const hasVariants = activeVariants.length > 0;

  const getDisplayPrice = () => {
    if (hasVariants && activeVariants[0]?.active_variant_items?.length > 0) {
      const firstVariantItem = activeVariants[0].active_variant_items[0];
      return {
        price: firstVariantItem.price ,
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
  // Check if the product with selected variants is already in cart
  const selectedVariantItemIds = Object.values(selectedVariantItems);
  const isInCart = isProductInCart(cart, product.id, selectedVariantItemIds);

  const handleAddToCart = async () => {
    // Check if all variants are selected (if there are any variants)
   checkAuthBeforeAction(async()=>{
 
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

    // Prepare variant data for API
    const variantData = hasVariants
      ? Object.entries(selectedVariantItems).map(([variantId, itemId]) => ({
          variantId: Number(variantId),
          itemId: Number(itemId),
        }))
      : [];

    // Call the addToCart function
    addToCart(product.id, quantity, variantData);
   })
  
    
   
  };

  const handleVariantItemSelect = (variantId: number, itemId: number) => {
    setSelectedVariantItems((prev) => ({
      ...prev,
      [variantId]: itemId,
    }));
  };

  const handleDirectAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    checkAuthBeforeAction( async()=>( await handleAddToCart()))
   
  };

  return (
    <div
      className={`font-manrope flex-shrink-0 w-[20%] snap-start transition-all duration-300 relative bg-white ${
        isHovered ? "border border-black" : "border"
      }`}
      style={{ width: "100%" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative lg:h-[300px] h-[350px] w-full bg-[var(--primary-color)] p-4">
        {isHovered && !catalogStatus ? (
          <button
            className="absolute top-2 right-2 cursor-pointer z-10"
            onClick={handleWishlistAction}
            disabled={isWishlistLoading}
          >
            <Heart
              className="h-5 w-5"
              fill={isInWishlist ? "currentColor" : "none"}
            />
          </button>
        ) : null}

        <Image
          src={
            `${process.env.NEXT_PUBLIC_BASE_URL}${product.thumb_image}` ||
            "/placeholder.svg"
          }
          alt={product.name}
          fill
          className="object-contain"
        />

        {/* Quick view and Add to cart buttons - visible on hover */}
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1 mx-2">
            <button
              className="w-full py-2 cursor-pointer flex items-center justify-center gap-2 bg-white hover:bg-black hover:text-white text-black text-sm"
              onClick={(e) => {
                e.preventDefault();
                onQuickView();
              }}
            >
              <Eye className="h-4 w-4" />
              <span className="font-manrope">QUICK VIEW</span>
            </button>
            {!catalogStatus ? (
              hasVariants ? (
                <Drawer>
                  <DrawerTrigger asChild>
                    <button className="w-full py-2 flex cursor-pointer items-center justify-center gap-2 bg-white hover:bg-black hover:text-white text-black text-sm">
                      {isInCart ? (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          <span className="font-manrope">GO TO CART</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          <span className="font-manrope">ADD TO CART</span>
                        </>
                      )}
                    </button>
                  </DrawerTrigger>
                  <DrawerContent className="max-h-[80vh] overflow-y-auto">
                    <div className="mx-auto w-full max-w-md p-4">
                      <DrawerHeader>
                        <DrawerTitle className="text-center">
                          {product.short_name}
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
                                    selectedVariantItems[variant.id] === item.id
                                      ? "bg-black text-white"
                                      : "bg-white text-black"
                                  }`}
                                  onClick={() =>
                                    handleVariantItemSelect(variant.id, item.id)
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
                          <Button onClick={handleAddToCart}>ADD TO CART</Button>
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
                  className="w-full py-2 flex cursor-pointer items-center justify-center gap-2 bg-white hover:bg-black hover:text-white text-black text-sm"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="font-manrope">GO TO CART</span>
                </Link>
              ) : (
                <button
                  className="w-full py-2 flex cursor-pointer items-center justify-center gap-2 bg-white hover:bg-black hover:text-white text-black text-sm"
                  onClick={handleDirectAddToCart}
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-manrope">ADD TO CART</span>
                </button>
              )
            ) : null}
          </div>
        )}
      </div>
      <Link href={`/shop/${categorySlug}/${product.slug}`}>
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-sm mb-1">{product.short_name}</h3>
            {product.averageRating !== "0" && (
              <div className="flex items-center mb-1">
                <span className="text-xs">★</span>
                <span className="text-xs ml-1">{product.averageRating}</span>
              </div>
            )}
          </div>

          <p className="text-xs font-manrope text-gray-600 mb-2 line-clamp-4">
            {product.short_description}
          </p>

          {showPrice ? (
            <div className="flex items-center gap-2">
              {displayPrice.offer_price ? (
                <>
                  <span className="font-[12px] font-manrope text-red-500">
                    {currency_icon}
                    {displayPrice.offer_price}
                  </span>
                  <span className="text-xs font-manrope text-gray-400 line-through">
                    {currency_icon}
                    {displayPrice.price}
                  </span>
                </>
              ) : (
                <span className="font-medium text-sm">
                  {currency_icon}
                  {displayPrice.price}
                </span>
              )}
            </div>
          ) : null}
        </div>
      </Link>
    </div>
  );
}
