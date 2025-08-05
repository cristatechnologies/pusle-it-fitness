// Theme/Helpers/SingleCategoryBanner.tsx
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

interface SingleCategoryBannerProps {
  category: Category;
  baseUrl?: string;
}

const SingleCategoryBanner: React.FC<SingleCategoryBannerProps> = ({
  category,

}) => {
  return (
    <div className="w-full min-h-full">
      <Link href={`/shop/${category.slug}`} className="block group">
        <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ">
          <div className="relative h-64 md:h-80 lg:h-96">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${category.image}`}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 "
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw 100vh, 70vw"
            />
            <div className="absolute inset-0  group-hover:bg-opacity-30 transition-all duration-300" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="flex items-center space-x-3">
              <i className={`${category.icon} text-white text-2xl`} />
              <h3 className="text-white text-xl md:text-2xl font-bold">
                {category.name}
              </h3>
            </div>
            <p className="text-white/80 text-sm mt-2">Explore our collection</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SingleCategoryBanner;
