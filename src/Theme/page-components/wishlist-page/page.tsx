"use client";

import Image from "next/image";
import { Grid, Plus, Minus, ShoppingCart, X, Heart } from "lucide-react";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hook";
import { useEffect, useState } from "react";
import {
  fetchWishlist,
  removeFromWishlist,
} from "@/lib/redux/features/wishlist/thunks";
import Link from "next/link";
import toast from "react-hot-toast";
import { settings } from "@/lib/redux/features/website/settings";
import { addToCart } from "@/services/cart";
import { isProductInCart } from "@/lib/redux/features/cart/utils";
import { checkAuthBeforeAction } from "../../../../middleware/isAuth";
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
// import { CartProduct } from "@/lib/redux/features/cart/types";
import { Product } from "@/Theme/types/product";
import { withAuth } from "../../../../middleware/isAuth";


interface Variant {
  id: number;
  name: string;
  product_id: number;
  active_variant_items: VariantItem[];
}

interface VariantItem {
  id: number;
  product_variant_id: number;
  name: string;
  price: number;
}




const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const { currency_icon } = settings();
  const {
    data: wishlist,
    status,
    error,
  } = useAppSelector((state) => state.wishlist);
  const cart = useAppSelector((state) => state.cart);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantItems, setSelectedVariantItems] = useState<
    Record<number, number>
  >({});
  const [variantError, setVariantError] = useState<string | null>(null);

  const handleRemoveFromWishlist = async (id: number) => {
    try {
      await dispatch(removeFromWishlist(id)).unwrap();
      toast.success("Removed from wishlist");
      dispatch(fetchWishlist()); // Refresh the wishlist
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove item"
      );
    }
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Wishlist", href: "/wishlist" },
  ];

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleAddToCart = async (product: Product) => {
    checkAuthBeforeAction(async () => {
      const hasVariants = (product?.active_variants ?? []).length > 0;

      if (hasVariants) {
        const missingVariants =
          product.active_variants?.filter(
            (variant: Variant) => !selectedVariantItems[variant.id]
          ) || [];

        if (missingVariants.length > 0) {
          setVariantError(
            `Please select ${missingVariants
              .map((v: Variant) => v.name)
              .join(" and ")}`
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

      const success = await addToCart(product.id, quantity, variantData);

      if (success) {
        toast.success("Item added to cart successfully!");
      }
    });
  };

  const handleVariantItemSelect = (variantId: number, itemId: number) => {
    setSelectedVariantItems((prev) => ({
      ...prev,
      [variantId]: itemId,
    }));
  };

  const handleDirectAddToCart = async (product: Product) => {
    checkAuthBeforeAction(async () => {
      const success = await addToCart(product.id, 1, []);
      if (success) {
        toast.success("Item added to cart successfully!");
      }
    });
  };

  if (status === "loading") {
    return (
      <>
        <BreadcrumbNav items={breadcrumbItems} />
        <div className="container mx-auto py-8 px-4 font-manrope">
          <h1 className="text-center text-2xl font-medium mb-8">WISHLIST</h1>
          <div className="text-center">Loading wishlist...</div>
        </div>
      </>
    );
  }

  if (status === "failed") {
    return (
      <>
        <BreadcrumbNav items={breadcrumbItems} />
        <div className="container mx-auto py-8 px-4 font-manrope">
          <h1 className="text-center text-2xl font-medium mb-8">WISHLIST</h1>
          <div className="text-center text-red-500">
            Error: {error || "Failed to load wishlist"}
          </div>
        </div>
      </>
    );
  }

  const wishlistItems = wishlist?.wishlists?.data || [];

console.log("wishlist", wishlistItems);

  if (wishlistItems.length === 0) {
    return (
      <>
        <BreadcrumbNav items={breadcrumbItems} />
        <h1 className="text-center text-2xl font-semibold border-b-2 py-4 mb-8">
          WISHLIST
        </h1>
        <div className="container mx-auto py-8 w-full font-manrope">
          <div className="flex flex-col items-center justify-center py-20 text-center">
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
      </>
    );
  }

  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <h1 className="text-center text-2xl py-6 font-semibold border-b-2 mb-8">
        WISHLIST
      </h1>
      <div className="container mx-auto py-8 px-4 font-manrope">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-t">
                <th className="py-4 text-left font-normal text-gray-600 pl-4 text-sm">
                  PRODUCT
                </th>
                <th className="py-4 text-left font-normal text-gray-600 text-sm">
                  PRICE
                </th>
                <th className="py-4 text-left font-normal text-gray-600 text-sm">
                  STOCK STATUS
                </th>
                <th className="py-4"></th>
              </tr>
            </thead>
            <tbody>
              {wishlistItems.map((item) => {
                const product = item.product as unknown as Product;
                const hasVariants = product.active_variants?.length > 0;
                const isInCart = isProductInCart(
                  cart,
                  product.id,
                  Object.values(selectedVariantItems)
                );

                return (
                  <tr
                    key={item.id}
                    className="border-b group relative hover:bg-gray-50 transition-colors !font-manrope"
                  >
                    <td className="py-6 pl-4">
                      <div className="flex items-center gap-4 relative">
                        <div className="relative w-16 h-20 bg-gray-100 flex items-center justify-center overflow-hidden">
                          <Image
                            src={
                              `${process.env.NEXT_PUBLIC_BASE_URL}${product.thumb_image}` ||
                              "/placeholder.svg?height=64&width=64"
                            }
                            alt={product.name}
                            width={64}
                            height={80}
                            className="object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromWishlist(item.id);
                            }}
                            className="cursor-pointer absolute top-2 left-2 bg-white text-black rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:shadow-sm"
                            aria-label="Remove from wishlist"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-medium text-sm font-manrope">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-6">
                      {product.offer_price ? (
                        <div className="flex flex-col">
                          <span className="font-[550]">
                            {currency_icon}
                            {product.offer_price.toFixed(2)}
                          </span>
                          <span className="line-through text-gray-400 text-sm">
                            {currency_icon}
                            {product.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold">
                          {currency_icon}
                          {product.price.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="py-6 uppercase text-green-800 font-medium text-sm">
                      {product.qty > 0
                        ? product.qty > 10
                          ? "IN STOCK"
                          : `${product.qty} IN STOCK`
                        : "OUT OF STOCK"}
                    </td>
                    <td className="py-6 pr-4">
                      {product.qty > 0 ? (
                        hasVariants ? (
                          <Drawer>
                            <DrawerTrigger asChild>
                              <Button variant="outline" className="w-full">
                                {isInCart ? (
                                  <>
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    GO TO CART
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    ADD TO CART
                                  </>
                                )}
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent className="max-h-[80vh] overflow-y-auto">
                              <div className="mx-auto w-full max-w-md p-4">
                                <DrawerHeader>
                                  <DrawerTitle className="text-center">
                                    {product.name}
                                  </DrawerTitle>
                                </DrawerHeader>

                                <div className="space-y-6">
                                  {product.active_variants?.map((variant) => (
                                    <div key={variant.id} className="space-y-3">
                                      <h3 className="font-medium uppercase text-center">
                                        {variant.name}
                                      </h3>
                                      <div className="flex flex-wrap justify-center gap-2">
                                        {variant.active_variant_items.map(
                                          (item) => (
                                            <button
                                              key={item.id}
                                              className={`px-4 py-2 border text-sm ${
                                                selectedVariantItems[
                                                  variant.id
                                                ] === item.id
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
                                              {item.price > 0 &&
                                                ` (${currency_icon}${item.price})`}
                                            </button>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  {variantError && (
                                    <div className="text-red-500 text-sm text-center">
                                      {variantError}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center justify-center space-x-4 mt-6">
                                  <div className="flex items-center border">
                                    <button
                                      className="px-3 py-2 cursor-pointer border-r"
                                      onClick={() =>
                                        setQuantity((prev) =>
                                          Math.max(1, prev - 1)
                                        )
                                      }
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-4 py-2">
                                      {quantity}
                                    </span>
                                    <button
                                      className="px-3 py-2 cursor-pointer border-l"
                                      onClick={() =>
                                        setQuantity((prev) => prev + 1)
                                      }
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
                                    <Button
                                      onClick={() => handleAddToCart(product)}
                                    >
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
                        ) : isInCart ? (
                          <Link href="/cart" className="w-full">
                            <Button variant="outline" className="w-full">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              GO TO CART
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleDirectAddToCart(product)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            ADD TO CART
                          </Button>
                        )
                      ) : (
                        <Link
                          href={`/shop/${product.category.slug}/${product.slug}`}
                        >
                          <Button variant="outline" className="w-full">
                            <Grid className="h-4 w-4 mr-2" />
                            VIEW PRODUCT
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};


export default 
  withAuth(WishlistPage, {
    redirectTo: "/sign-in",
    requireAuth: true,
    authMessage: "Sign in to access this feature",
  });
