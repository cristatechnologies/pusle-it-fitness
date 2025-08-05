"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FeaturedCategory } from "@/lib/redux/features/homepage/types";

// interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   image: string;
// }



interface Props {
  featuredCategories?: FeaturedCategory[];
}


const CategoriesSpherical: React.FC<Props> = ({ featuredCategories }) => {
    const router = useRouter();
    
    console.log("featured categories ", featuredCategories);
  return (
    <div className="font-manrope container mx-auto px-4 pb-10 ">
      <h1 className="text-3xl font-bold text-center uppercase mb-8 text-[var(--primary-text-color)] font-manrope">
        Explore Pulseit&apos;s Featured Categories
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {featuredCategories?.map((item, i) => {
          const category = item.category;
          return (
            <div
              key={category.id}
              data-aos="fade-left"
              data-aos-delay={`${i}00`}
              className="flex flex-col items-center"
              onClick={() => router.push(`/shop/${category.slug}`)}
            >
              <div className="relative w-full aspect-[1/1] mb-2 cursor-pointer group">
                {/* Image Container */}
                <div className="relative w-full h-full rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${category.image}`} // Adjust if needed
                    alt={category.name || "Category Image"}
                    layout="fill"
                    objectFit="cover"
                    className="hover:opacity-90 transition-opacity duration-300"
                  />
                  {/* Overlay Text */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                    <p className="text-white text-center text-sm font-medium uppercase px-2">
                      {category.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesSpherical;
