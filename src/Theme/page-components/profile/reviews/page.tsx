//@Theme/page-components/profile/reviews/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchUserReviews } from "@/services/profileApi";
import toast from "react-hot-toast";
import { withAuth } from "../../../../../middleware/isAuth";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import ProfileNavbar from "../navbar";
import { Star, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ReviewPageState {
  reviews: {
    data: {
      id: number;
      product_id: number;
      user_id: number;
      review: string;
      rating: number;
      status: number;
      created_at: string | null;
      updated_at: string | null;
      product: {
        id: number;
        name: string;
        short_name: string;
        slug: string;
        thumb_image: string;
        qty: number;
        sold_qty: number;
        price: number;
        offer_price: number | null;
        averageRating: string;
        totalSold: string;
      };
    }[];
    current_page: number;
    last_page: number;
    total: number;
  } | null;
  loading: boolean;
}

const ReviewsPage = () => {
  const [state, setState] = useState<ReviewPageState>({
    reviews: null,
    loading: true,
  });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchUserReviews();
        setState({
          reviews: data.reviews,
          loading: false,
        });
      } catch (error) {
        toast.error("Failed to load reviews");
        console.log("Reviews error:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadReviews();
  }, []);

  if (state.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile/dashboard" },
    { label: "Reviews", href: "/profile/reviews" },
  ];

  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="font-manrope container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">MY REVIEWS</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="border rounded p-6">
              <h2 className="text-lg font-bold uppercase mb-6">
                Product Reviews
              </h2>

              {state.reviews?.data.length ? (
                <div className="space-y-6">
                  {state.reviews.data.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-6 last:border-b-0"
                    >
                      <div className="flex items-start space-x-4">
                        <Link
                          href={`/shop/${review.product.slug}`}
                          className="flex-shrink-0"
                        >
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${review.product.thumb_image}`}
                            alt={review.product.name}
                            width={80}
                            height={80}
                            className="rounded object-cover"
                          />
                        </Link>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <Link href={`/product/${review.product.slug}`}>
                              <h3 className="font-bold hover:text-primary">
                                {review.product.name}
                              </h3>
                            </Link>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>
                                {review.created_at
                                  ? new Date(
                                      review.created_at
                                    ).toLocaleDateString()
                                  : "No date"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center mt-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700">{review.review}</p>
                          {review.status === 0 && (
                            <div className="mt-2 text-sm text-yellow-600 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Pending approval</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    You have`&apos;`t reviewed any products yet.
                  </p>
                </div>
              )}
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

export default withAuth(ReviewsPage, {
  redirectTo: "/sign-in",
  requireAuth: true,
  authMessage: "Please sign in to view your reviews",
});
