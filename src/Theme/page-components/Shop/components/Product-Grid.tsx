"use client";
import { useState } from "react";
import ProductCard from "./Product-Card";
import QuickViewModal from "@/Theme/Helpers/Quick-View-Modal";
import { Product } from "@/lib/redux/features/homepage/types";

interface ProductGridProps {
  products: Product[];
  categorySlug?: string;
}

export default function ProductGrid({ products, categorySlug }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeQuickView = () => {
    setIsModalOpen(false);
  };

  console.log(products)


  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  h-full">
        {products.map((product) => (
          <ProductCard
            categorySlug={categorySlug}
            key={product.id}
            product={product}
            onQuickView={openQuickView}
          />
        ))}
      </div>

      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeQuickView}
      />
    </>
  );
}
