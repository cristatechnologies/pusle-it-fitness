"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Product } from "@/Theme/types/product";
import { settings } from "@/lib/redux/features/website/settings";
import { useAppSelector } from "@/lib/redux/hook";

interface RelatedProductsProps {
  relatedProducts: Product[];
}

export default function RelatedProducts({
  relatedProducts,
}: RelatedProductsProps) {
  const showPrice = useAppSelector(
    (state) => state.website.data?.catalog_mode?.show_price
  );

  const { currency_icon } = settings();

  // Helper function to calculate display price
  const getDisplayPrice = (product: Product) => {
    const activeVariants = product.active_variants || [];
    const hasVariants = activeVariants.length > 0;

    if (hasVariants && activeVariants[0]?.active_variant_items?.length > 0) {
      const firstVariantItem = activeVariants[0].active_variant_items[0];
      return {
        price: firstVariantItem.price,
        offer_price: product.offer_price
          ? firstVariantItem.price + product.offer_price
          : null,
      };
    }
    return {
      price: product.price,
      offer_price: product.offer_price,
    };
  };
  
  console.log("related products",relatedProducts)
  return (
    <div className="font-manrope border-t pt-12">
      <h2 className="text-2xl font-bold text-center mb-8 uppercase">
        RELATED PRODUCTS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 border-t">
        {relatedProducts.map((product) => {
          // Get display price for this product
          const displayPrice = getDisplayPrice(product);

          return (
            <div
              key={product.id}
              className="border-r border-b p-4 flex flex-col"
            >
              <Link
                href={`/shop/${product.category.slug}/${product.slug}`}
                className="block relative aspect-square mb-4 overflow-hidden"
              >
                <Image
                  src={
                    ` ${process.env.NEXT_PUBLIC_BASE_URL}${product.thumb_image}` ||
                    "/placeholder.svg?height=300&width=300"
                  }
                  alt={product.name}
                  fill
                  className="object-contain hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <div className="mt-auto">
                <h3 className="font-medium text-sm mb-1">
                  <Link
                    href={`/shop/${product.category.slug}/${product.slug}`}
                    className="hover:underline"
                  >
                    {product.name}
                  </Link>
                </h3>

                {product.rating && (
                  <div className="flex items-center mb-1">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-current text-black" />
                    </div>
                    <span className="text-xs ml-1">{product.rating}</span>
                  </div>
                )}

                {showPrice ? (
                  <div className="flex items-center gap-2">
                    {displayPrice.offer_price ? (
                      <>
                        <span className="font-[12px] font-manrope text-red-500">
                          {currency_icon}
                          {displayPrice.offer_price}
                        </span>
                        <span className="text-xs font-manrope text-gray-400 line-through">
                          {currency_icon}
                          {displayPrice.price}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium text-sm">
                        {currency_icon}
                        {displayPrice.price}
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
