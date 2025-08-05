// Theme/Helpers/TripleCategoryBanner.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  image: string;
}

interface TripleCategoryBannerProps {
  categories: Category[];
  baseUrl?: string;
}

const TripleCategoryBanner: React.FC<TripleCategoryBannerProps> = ({
  categories,

}) => {
  // Ensure we only show 3 categories max
  const displayCategories = categories.slice(0, 3);

  return (
    <div className="w-full px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayCategories.map((category, index) => (
          <Link
            key={index}
            href={`/category/${category.slug}`}
            className="block group"
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <div className="relative h-48 md:h-56 lg:h-64">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${category.image}`}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                />
                <div className="absolute inset-0  bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center space-x-2">
                  <i className={`${category.icon} text-white text-lg`} />
                  <h3 className="text-white text-lg font-bold">
                    {category.name}
                  </h3>
                </div>
                <p className="text-white/80 text-sm mt-1">Shop now</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TripleCategoryBanner;
