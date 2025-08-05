"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Heart, Share2, Check } from "lucide-react";
import { Product } from "@/lib/redux/features/homepage/types";
import { settings } from "@/lib/redux/features/website/settings";
import { useAppSelector } from "@/lib/redux/hook";
import { addToCart } from "@/services/cart";
import { isProductInCart } from "@/lib/redux/features/cart/utils";
import { addToWishlist,removeFromWishlist } from "@/lib/redux/features/wishlist/thunks";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { AppDispatch } from "@/lib/redux/store";
import Link from "next/link";
import { checkAuthBeforeAction } from "../../../middleware/isAuth";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {

  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useAppSelector(
    (state) => state.wishlist.data?.wishlists?.data
  );
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Check if product is in wishlist
  const isInWishlist = wishlist?.some(
    (item) => item.product_id === product?.id
  );

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
          if (wishlistItem) {
            await dispatch(removeFromWishlist(wishlistItem.id)).unwrap();
            toast.success("Removed from wishlist");
          }
        } else {
          await dispatch(addToWishlist(product.id)).unwrap();
          toast.success("Added to wishlist");
        }
      } catch (err) {
        toast.error("Failed to update wishlist");
        console.log("Wishlist action error:", err);
      } finally {
        setIsWishlistLoading(false);
      }
    });
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantItems, setSelectedVariantItems] = useState<
    Record<number, number>
  >({});
  const [variantError, setVariantError] = useState<string | null>(null);
  const { currency_icon } = settings();
  const catalogStatus = useAppSelector(
    (state) => state.website.data?.catalog_mode?.status
  );
  const showPrice = useAppSelector(
    (state) => state.website.data?.catalog_mode?.show_price
  );
  const cart = useAppSelector((state) => state.cart);

  const activeVariants = product?.active_variants || [];
  const hasVariants = activeVariants.length > 0;

  useEffect(() => {
    // Reset selected variants when product changes
    setSelectedVariantItems({});
    setVariantError(null);
  }, [product]);

  if (!isOpen || !product) return null;

  const selectedVariantItemIds = Object.values(selectedVariantItems);
  const productInCart = isProductInCart(
    cart,
    product.id,
    selectedVariantItemIds
  );

  const handleAddToCart = async () => {
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


      await addToCart(product.id, quantity, variantData);
    
   


    })

    // Check if all variants are selected (if there are any variants)
  
  };

  const handleVariantItemSelect = (variantId: number, itemId: number) => {
    setSelectedVariantItems((prev) => ({
      ...prev,
      [variantId]: itemId,
    }));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="font-manrope fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
      <div className="relative bg-white max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer right-4 top-4 z-10"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row border-2 border-gray-300 shadow-lg">
          {/* Product image */}
          <div className="w-full md:w-1/2 p-8">
            <div className="relative aspect-square">
              <Image
                src={
                  `${process.env.NEXT_PUBLIC_BASE_URL}${product.thumb_image}` ||
                  "/placeholder.svg"
                }
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Product details */}
          <div className="w-full md:w-1/2 p-8 flex flex-col">
            <h2 className="text-[23px] font-medium mb-2 font-manrope">
              {product.short_name}
            </h2>

            {showPrice ? (
              <div className="flex items-center gap-2">
                {product.offer_price ? (
                  <>
                    <span className="font-medium text-sm text-red-500">
                      {currency_icon}
                      {product.offer_price}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {currency_icon}
                      {product.price}
                    </span>
                  </>
                ) : (
                  <span className="font-medium text-sm">
                    {currency_icon}
                    {product.price}
                  </span>
                )}
              </div>
            ) : null}

            <div className="text-sm text-gray-700 mb-6">
              <p>{product.short_description}</p>
            </div>

            {/* Variant Selection */}
            {hasVariants && (
              <div className="space-y-4 mb-4">
                {activeVariants.map((variant) => (
                  <div key={variant.id} className="space-y-2">
                    <h3 className="font-medium text-sm">{variant.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {variant.active_variant_items.map((item) => (
                        <button
                          key={item.id}
                          className={`px-3 py-1 border text-xs ${
                            selectedVariantItems[variant.id] === item.id
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          }`}
                          onClick={() =>
                            handleVariantItemSelect(variant.id, item.id)
                          }
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {variantError && (
                  <div className="text-red-500 text-xs">{variantError}</div>
                )}
              </div>
            )}

            {/* Quantity selector and Add to Cart */}
            {!catalogStatus && (
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <button
                    onClick={handleDecrement}
                    className="w-10 h-10 border cursor-pointer border-gray-300 flex items-center justify-center"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-10 h-10 border-t border-b border-gray-300 text-center"
                  />
                  <button
                    onClick={handleIncrement}
                    className="w-10 h-10 border cursor-pointer border-gray-300 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {productInCart ? (
                  <Link
                    href="/cart"
                    className="ml-4 bg-black text-white px-6 py-3 text-xs font-manrope flex items-justify-between gap-2"
                    >
                    <Check className="h-4 w-4" />
                  <p>GO TO CART</p>

                  </Link>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="ml-4 bg-black text-white px-6 py-3 text-xs font-manrope"
                  >
                    ADD TO CART
                  </button>
                )}
              </div>
            )}

            {/* Wishlist and share */}
            <div className="flex items-center gap-6 mt-auto">
              {!catalogStatus && (
                <button
                  className="flex items-center gap-2 cursor-pointer text-sm text-gray-600"
                  onClick={handleWishlistAction}
                  disabled={isWishlistLoading}
                >
                  <Heart
                    className="h-4 w-4"
                    fill={isInWishlist ? "currentColor" : "none"}
                  />
                  {isInWishlist ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}
                </button>
              )}
              <button className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <Share2 className="h-4 w-4" />
                SHARE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
