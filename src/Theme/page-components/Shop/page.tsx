"use client";

import ProductGrid from "./components/Product-Grid";
import CategoryBar from "./components/CategoryBar";
import ShopHeader from "./components/shop-header";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ApiResponse } from "@/app/shop/types/shop-types";

interface CategoryPageProps {
  data: ApiResponse;
  categorySlug?: string;
}

export default function CategoryPage({
  data,
  categorySlug,
}: CategoryPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

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

      {data.products.last_page && data.products.last_page > 1 ? (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-8">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === data.products.last_page}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{data.products.from ?? 0}</span>{" "}
                to <span className="font-medium">{data.products.to ?? 0}</span>{" "}
                of{" "}
                <span className="font-medium">{data.products.total ?? 0}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  &larr;
                </button>
                {Array.from(
                  {
                    length: Math.min(5, data.products.last_page),
                  },
                  (_, i) => {
                    const lastPage = data.products.last_page;
                    let pageNum;
                    if (lastPage <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= lastPage - 2) {
                      pageNum = lastPage - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? "z-10 bg-[#c69657] border-[#c69657] text-white"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === data.products.last_page}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
