"use client";

import { Skeleton } from "@/Theme/shadcn/components/ui/skeleton";

const CheckoutSkeleton = () => {
  return (
    <>
      {/* Breadcrumb Skeleton */}
      <div className="container py-4">
        <div className="flex space-x-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="container">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
      </div>

      <div className="container lg:px-[50px] py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address Section */}
          <div className="lg:col-span-2">
            <div className="border p-6 mb-8">
              {/* Tabs Skeleton */}
              <div className="flex border-b mb-6">
                <Skeleton className="h-10 w-32 mx-4" />
                <Skeleton className="h-10 w-32 mx-4" />
              </div>

              {/* Address Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border p-4">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <Skeleton className="h-5 w-5" />
                    </div>
                    <Skeleton className="h-4 w-40 mt-2" />
                  </div>
                ))}
              </div>

              {/* Add New Address Button Skeleton */}
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="border p-6">
              {/* Coupon Section Skeleton */}
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </div>

              {/* Order Title Skeleton */}
              <Skeleton className="h-6 w-32 mb-6" />

              {/* Cart Items Skeleton */}
              <div className="space-y-4 mb-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>

              {/* Subtotal Skeleton */}
              <div className="flex justify-between py-4 border-t border-b mb-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>

              {/* Shipping Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-5 w-24 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              {/* Total Skeleton */}
              <div className="flex justify-between py-4 border-t border-b mb-6">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>

              {/* Payment Methods Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 p-3 border rounded-md"
                    >
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Place Order Button Skeleton */}
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutSkeleton;
