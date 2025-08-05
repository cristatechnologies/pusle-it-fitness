import { Category } from "@/app/shop/types/shop-types";
import Image from "next/image";
import Link from "next/link";

interface CategoryBarProps {
  categoryName: string;
  categories?: Category[];
  activeCategory?: string;
}

export default function CategoryBar({
  categories,
  activeCategory,
  categoryName,
}: CategoryBarProps) {
  // Only use top-level categories (those without parent_id or parent_id is null)
  const topLevelCategories = categories?.filter((cat) => cat.parent_id === null);


  return (
    <div className="w-full border-t border-b border-gray-200 mt-2 mb-8">
      <div className="flex items-center justify-between ">
        <div className="font-roboto">{categoryName}</div>
        <div className="flex overflow-x-auto no-scrollbar">
          {topLevelCategories?.map((category) => (
            <Link
              key={category.id}
              href={`/shop/${category.slug}`}
              className={`flex flex-col items-center justify-center min-w-[160px] py-4 px-2 border-r border-gray-200 ${
                activeCategory === category.slug ? "bg-gray-100" : ""
              }`}
            >
              <div className="w-[120px] h-[120px] flex items-center justify-center border border-gray-200 mb-2">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${category.image}`}
                  alt={category.name}
                  width={160}
                  height={160}
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-medium uppercase">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
