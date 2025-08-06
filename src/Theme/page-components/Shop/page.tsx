"use client";

import ProductGrid from "./components/Product-Grid";
import CategoryBar from "./components/CategoryBar";
import ShopHeader from "./components/shop-header";

import { ApiResponse } from "@/app/shop/types/shop-types";




interface CategoryPageProps {
  data: ApiResponse;
  categorySlug?: string;
}
export default function CategoryPage({
  data,
  categorySlug,
}: CategoryPageProps) {
  
  const categoryName = categorySlug
    ? data.categories.find((cat) => cat.slug === categorySlug)?.name
    : "All Products";



  const headerBreadcrumbs = [
    { label: "HOME", href: "/" },
    { label: "SHOP", href: "/shop" },
    ...(categorySlug
      ? [{ label: categorySlug.toUpperCase(), href: `/shop/${categorySlug}` }]
      : []),
  ];


  console.log("Category Page Data:", categoryName);

  return (
    <div className="container mx-auto py-8 px-4">
      <ShopHeader
        totalResults={data.products.total}
        breadcrumbs={headerBreadcrumbs}
      />

      <CategoryBar
        categoryName={categoryName!}
        categories={data.categories}
        activeCategory={categorySlug}
      />

      <ProductGrid products={data.products.data} categorySlug={categorySlug} />
    </div>
  );
}
