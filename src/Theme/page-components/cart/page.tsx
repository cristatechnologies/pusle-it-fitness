//src/Theme/page-components/cart/page.tsx
"use client";

import { useEffect } from "react";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hook";
import { fetchCart,clearCart } from "@/lib/redux/features/cart/thunk";
import { settings } from "@/lib/redux/features/website/settings";
import {  Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "@/Theme/shadcn/components/ui/button";
import { useRouter } from "next/navigation";
import { removeCartItem,incrementCartItem,decrementCartItem } from "@/services/cart";

import { withAuth } from "../../../../middleware/isAuth";




const MainCart = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currency_icon } = settings();
  const { data: cart, status, error } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleIncreaseQuantity = async (itemId: number) => {
    try {
      const success = await incrementCartItem(itemId);
      if (success) {
        dispatch(fetchCart());
      }
    }  catch {
      toast.error("Failed to update quantity");
    }
    
  };

  const handleDecreaseQuantity = async (itemId: number) => {
    try {
      const success = await decrementCartItem(itemId);
      if (success) {
        dispatch(fetchCart());
      }
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      const success = await removeCartItem(itemId);
      if (success) {
        dispatch(fetchCart());
        toast.success("Item removed from cart");
      }
    } catch {
      toast.error("Failed to remove item");
    }
  };


  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
     
      toast.success("Cart cleared successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to clear cart"
      );
    }
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
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
        Error: {error || "Failed to load cart"}
      </div>
    );
  }

  const cartItems = cart?.cartProducts || [];

  if (cartItems.length === 0) {
    return (
      <>
        <BreadcrumbNav items={breadcrumbItems} />
        <div className="font-manrope container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">YOUR CART</h1>

          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg shadow-sm">
            <div className="relative">
              <ShoppingBag
                className="w-20 h-20 text-gray-400"
                strokeWidth={1}
              />
            </div>

            <h2 className="mt-6 text-xl font-medium text-gray-800">
              Your Cart Is Currently Empty
            </h2>

            <p className="mt-2 text-gray-600 text-sm">
              Start shopping to add items to your cart
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

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + (item.product.offer_price || item.product.price) * item.qty,
    0
  );

  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="font-manrope container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">YOUR CART</h1>

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
                        QUANTITY
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SUBTOTAL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-20 bg-gray-100 flex items-center justify-center overflow-hidden">
                              <Image
                                src={
                                  `${process.env.NEXT_PUBLIC_BASE_URL}${item.product.thumb_image}` ||
                                  "/placeholder.svg"
                                }
                                alt={item.product.name}
                                width={64}
                                height={80}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-medium text-sm block">
                                {item.product.name}
                              </span>
                              {item.variants.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {item.variants.map((variant) => (
                                    <div key={variant.id}>
                                      {variant.variant_item.name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
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
                          <div className="flex items-center border border-gray-300 w-fit">
                            <button
                              onClick={() => handleDecreaseQuantity(item.id)}
                              disabled={item.qty <= 1}
                              className={`px-3 py-1 ${
                                item.qty <= 1
                                  ? "text-gray-300"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 py-1 border-x border-gray-300">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => handleIncreaseQuantity(item.id)}
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="font-semibold">
                            {currency_icon}
                            {(
                              (item.product.offer_price || item.product.price) *
                              item.qty
                            ).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Link
                href="/shop"
                className="px-6 py-3 border border-black text-black text-sm font-semibold hover:bg-black hover:text-white transition"
              >
                CONTINUE SHOPPING
              </Link>
              <button
                onClick={handleClearCart}
                className="px-6 py-3 border border-red-500 text-red-500 text-sm font-semibold hover:bg-red-500 hover:text-white transition"
              >
                CLEAR CART
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">CART TOTALS</h2>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    {currency_icon}
                    {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-b border-gray-200 mb-6">
                <span className="font-bold">TOTAL</span>
                <span className="font-bold text-xl">
                  {currency_icon}
                  {subtotal.toFixed(2)}
                </span>
              </div>

              <Button
                onClick={() => router.push("/checkout")}
                className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg"
              >
                PROCEED TO CHECKOUT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(MainCart, {
  redirectTo: "/sign-in",
  requireAuth: true,
  authMessage: "Please sign in to view your cart",
});
