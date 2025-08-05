"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Textarea } from "@/Theme/shadcn/components/ui/textarea";
import { Checkbox } from "@/Theme/shadcn/components/ui/checkbox";
import { Button } from "@/Theme/shadcn/components/ui/button";

interface ProductTabsProps {
  productData: {
    description: string;
    additionalInfo?: {
      color?: string;
      textile?: string;
      [key: string]: string | undefined;
    };
    reviews?: {
      id: number;
      name: string;
      rating: number;
      date: string;
      text: string;
      avatar?: string;
    }[];
  };
}

export default function ProductTabs({ productData }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "description" | "additional" | "reviews"
  >("description");
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const {  additionalInfo = {}, reviews = [] } = productData;
  const reviewCount = reviews.length;

  return (
    <div className="mt-16 font-manrope">
      {/* Tabs Navigation */}
      <div className="flex border-b">
        <button
          className={`uppercase px-4 py-3 font-medium text-sm ${
            activeTab === "description"
              ? "border-b-2 border-black"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
        <button
          className={`uppercase px-4 py-3 font-medium text-sm ${
            activeTab === "additional"
              ? "border-b-2 border-black"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("additional")}
        >
          Additional Information
        </button>
        <button
          className={`uppercase px-4 py-3 font-medium text-sm ${
            activeTab === "reviews"
              ? "border-b-2 border-black"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({reviewCount})
        </button>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="text-gray-700">
            <p>
              Lisola Sofa Retro is a modern outdoor seating piece. An luxury
              outdoor sofa created by the most refined design with delicate
              materials makes it an authentic luxury design piece. It fits
              perfectly in a contemporary outdoor project. At least it will make
              anyone want to come back to see it once again.
            </p>
            <ul className="mt-6 space-y-2 list-none">
              <li className="flex items-center">
                <span className="text-gray-500 mr-2">•</span>
                Width: 230 cm / 90.6 in
              </li>
              <li className="flex items-center">
                <span className="text-gray-500 mr-2">•</span>
                Depth: 93 cm / 36.6 in
              </li>
              <li className="flex items-center">
                <span className="text-gray-500 mr-2">•</span>
                Height: 62 cm / 24.4 in
              </li>
              <li className="flex items-center">
                <span className="text-gray-500 mr-2">•</span>
                Seat Height: 42 cm / 16.5 in
              </li>
              <li className="flex items-center">
                <span className="text-gray-500 mr-2">•</span>
                Upholstered in Patterned Fabric
              </li>
              <li className="flex items-center">
                <span className="text-gray-500 mr-2">•</span>
                Details in Black Leather
              </li>
            </ul>
          </div>
        )}

        {/* Additional Information Tab */}
        {activeTab === "additional" && (
          <div className="text-gray-700">
            <div className="flex">
              <span className="font-medium mr-2">COLOR:</span>
              <span>{additionalInfo.color || "White"}</span>
            </div>
            <div className="flex mt-2">
              <span className="font-medium mr-2">TEXTILE:</span>
              <span>{additionalInfo.textile || "Cotton"}</span>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div>
            {/* Reviews List */}
            <div className="space-y-8 mb-12">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                        {review.avatar ? (
                          <Image
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-black text-black"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{review.name}</span>
                        <span className="text-gray-400 text-xs uppercase">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">There are no reviews yet.</p>
              )}
            </div>

            {/* Add Review Form */}
            <div>
              <h3 className="font-bold text-lg mb-4">ADD A REVIEW</h3>
              <p className="text-sm text-gray-500 mb-6">
                Your email address will not be published. Required fields are
                marked *
              </p>

              <form className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm mr-2 uppercase font-medium">
                      YOUR RATING *
                    </span>
                    <div
                      className="flex"
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 cursor-pointer ${
                            star <= (hoveredRating || rating)
                              ? "fill-black text-black"
                              : "fill-gray-200 text-gray-200"
                          }`}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Textarea
                    placeholder="Your review *"
                    className="min-h-[150px] resize-none border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name *"
                    className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-black"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="save-info" />
                  <label htmlFor="save-info" className="text-sm leading-none">
                    Save my name, email, and website in this browser for the
                    next time I comment.
                  </label>
                </div>

                <Button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white rounded-none px-8 py-2"
                >
                  SUBMIT
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
