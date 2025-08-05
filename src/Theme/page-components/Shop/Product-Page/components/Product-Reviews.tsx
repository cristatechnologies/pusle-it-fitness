"use client";

import type React from "react";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/Theme/shadcn/components/ui/button";
import { Input } from "@/Theme/shadcn/components/ui/input";
import { Textarea } from "@/Theme/shadcn/components/ui/textarea";
import { Checkbox } from "@/Theme/shadcn/components/ui/checkbox";


interface Review {
  id: number;
  rating: number;
  review: string;
  user: {
    name: string;
    image?: string;
  };
  created_at?: string;
}

interface ProductReviewsProps {
  productReviews: Review[];
  productName: string;
  averageRating?: number; // Make it optional with ?
  totalReviews?: number; // Make it optional with ?
}

export default function ProductReviews({
  productReviews,
  productName,
}: ProductReviewsProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [saveInfo, setSaveInfo] = useState<boolean>(false);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (hoveredRating: number) => {
    setHoveredRating(hoveredRating);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle review submission logic here


    // Reset form
    setRating(0);
    setReviewText("");
    setName("");
    setEmail("");
    setSaveInfo(false);
  };

  return (
    <div className="font-manrope space-y-6">
      {/* Reviews List */}
      <div>
        {productReviews && productReviews.length > 0 ? (
          <div className="space-y-6">
            
            {productReviews.map((review, index) => (
              <div key={index} className="border-b pb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{review.user.name}</span>
                </div>
                <p className="text-gray-600">{review.review}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">There are no reviews yet.</p>
        )}
      </div>

      {/* Review Form */}
      <div>
        <h3 className="text-base font-bold mb-4">
          BE THE FIRST TO REVIEW `&quot;`{productName}`&quot;`
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Your email address will not be published. Required fields are marked *
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="mr-2 text-sm">YOUR RATING *</span>
              <div className="flex" onMouseLeave={handleRatingLeave}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 cursor-pointer ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => handleRatingHover(star)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              placeholder="Your review *"
              className="min-h-[150px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name *"
              />
            </div>
            <div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email *"
              />
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="save-info"
              checked={saveInfo}
              onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
            />
            <label htmlFor="save-info" className="text-sm">
              Save my name, email, and website in this browser for the next time
              I comment.
            </label>
          </div>

          <Button
            type="submit"
            className="bg-black hover:bg-gray-800 w-full md:w-auto"
          >
            SUBMIT
          </Button>
        </form>
      </div>
    </div>
  );
}
