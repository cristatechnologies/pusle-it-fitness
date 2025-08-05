"use client";

import Image from "next/image";
import { Heart, Eye, Plus } from "lucide-react";
import { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onQuickView: () => void;
}

export default function ProductCard({
  product,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onQuickView,
}: ProductCardProps) {
  return (
    <div
      className={`font-manrope flex-shrink-0 w-full snap-start transition-all duration-300 relative bg-white ${
        isHovered ? "border border-black" : "border border-transparent"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative lg:h-[325px] w-full bg-white p-4">
        {product.discount && (
          <div className="absolute top-2 left-2 z-10 bg-white border border-[#f0c14b] text-[#f0c14b] px-2 py-1 text-xs">
            {product.discount}
          </div>
        )}

        {isHovered && (
          <button className="absolute top-2 right-2 z-10">
            <Heart className="h-5 w-5" />
          </button>
        )}

        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-contain"
        />

        {/* Quick view and Add to cart buttons - visible on hover */}
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1 mx-2">
            <button
              className="w-full py-2 flex items-center justify-center gap-2 bg-white hover:bg-black hover:text-white text-black text-sm"
              onClick={(e) => {
                e.preventDefault();
                onQuickView();
              }}
            >
              <Eye className="h-4 w-4" />
              <span className="font-manrope">QUICK VIEW</span>
            </button>
            <button className="w-full py-2 flex items-center justify-center gap-2 bg-white hover:bg-black hover:text-white text-black text-sm">
              <Plus className="h-4 w-4" />
              <span className="font-manrope">ADD TO CART</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-4 bg-white">
        {/* {product. && (
          <div className="text-xs uppercase text-gray-500 mb-1">
            {product.brand?.name}
          </div>
        )} */}
        <h3 className="font-medium text-sm mb-1">{product.name}</h3>

        {product.rating && (
          <div className="flex items-center mb-1">
            <span className="text-xs">★</span>
            <span className="text-xs ml-1">{product.rating}</span>
          </div>
        )}

        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {product.offer_price ? product.offer_price : product.price}
          </span>
          {product.offer_price && (
            <span className="text-xs text-gray-400 line-through">
              {product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
