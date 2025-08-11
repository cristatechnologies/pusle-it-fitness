import { notFound } from "next/navigation";
import ProductPage from "@/Theme/page-components/Shop/Product-Page/page";
import type { Metadata } from "next";
import type { ProductResponse } from "@/Theme/types/product";

export const revalidate = 3600; // 1 hour

interface ProductMeta {
  slug: string;
  seo_title?: string;
  seo_description?: string;
  category_slug: string;
}

// cache variable so we don't re-fetch every call
let allProductsCache: ProductMeta[] | null = null;

// Fetch once & cache
async function fetchAllProductsMeta(): Promise<ProductMeta[]> {
  if (allProductsCache) return allProductsCache;

  const res = await fetch(
    "https://s1.shopico.in/pulseit2/api/user/metadata?product-all=true",
    { next: { revalidate } }
  );

  if (!res.ok) throw new Error("Failed to fetch all products metadata");
  const data = await res.json();

  const products = data.metadata || [];
  allProductsCache = products;
  return products;
}

// Pre-render only valid products
export async function generateStaticParams() {
  const products = await fetchAllProductsMeta();

  const validProducts = products.filter((p) => p.category_slug && p.slug);

  console.log("Static paths count:", validProducts.length);

  return validProducts.map((p) => ({
    category: p.category_slug,
    product: p.slug,
  }));
}

// Metadata from pre-fetched data
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const products = await fetchAllProductsMeta();
  

  // Store the awaited params values in variables
  const { category, product } = resolvedParams;

  const meta = products.find(
    (p) => p.slug === product && p.category_slug === category
  );

  if (!meta) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: meta.seo_title || "Product",
    description: meta.seo_description || "",
    openGraph: {
      title: meta.seo_title || "Product",
      description: meta.seo_description || "",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.seo_title || "Product",
      description: meta.seo_description || "",
    },
  };
}

// Still fetch full product data for rendering page content
async function getProductData(product: string): Promise<ProductResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/product/${product}`,
    { next: { revalidate } }
  );
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const resolvedParams = await params;
  let productData: ProductResponse;

  try {
    productData = await getProductData(resolvedParams.product);
    if (!productData?.product) notFound();
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }

  return <ProductPage productData={productData} />;
}
