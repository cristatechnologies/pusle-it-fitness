import { notFound } from "next/navigation";
import ProductPage from "@/Theme/page-components/Shop/Product-Page/page";
import type { Metadata } from "next";
import type { ProductResponse } from "@/Theme/types/product";
import { unstable_cache } from "next/cache";

export const revalidate = 3600; // 1 hour - fallback revalidation

interface ProductMeta {
  slug: string;
  seo_title?: string;
  seo_description?: string;
  category_slug: string;
}

// Enhanced cache function with tags
const getCachedProductsMeta = unstable_cache(
  async (): Promise<ProductMeta[]> => {
    console.log("🔍 Fetching all products metadata...");

    try {
      const res = await fetch(
        "https://s1.shopico.in/pulseit2/api/user/metadata?product-all=true",
        {
          next: {
            revalidate: 3600,
            tags: ["products-meta"],
          },
        }
      );

      console.log(`📊 Metadata API Response: ${res.status} ${res.statusText}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ Metadata API Error (${res.status}):`, errorText);
        throw new Error(
          `Failed to fetch all products metadata: ${res.status} - ${errorText}`
        );
      }

      const data = await res.json();
      const products = data.metadata || [];

      console.log(
        `✅ Successfully fetched ${products.length} products metadata`
      );

      return products;
    } catch (error) {
      console.error("🔥 Error fetching products metadata:", error);
      throw error;
    }
  },
  ["products-metadata"],
  {
    revalidate: 3600,
    tags: ["products-meta"],
  }
);

// Pre-render only valid products
export async function generateStaticParams() {
  try {
    console.log("🚀 Generating static params for products...");
    const products = await getCachedProductsMeta();

    const validProducts = products.filter((p) => {
      const isValid = p.category_slug && p.slug;
      if (!isValid) {
        console.warn("⚠️ Invalid product filtered out:", {
          slug: p.slug,
          category_slug: p.category_slug,
          seo_title: p.seo_title,
        });
      }
      return isValid;
    });

    console.log(
      `📦 Generating static paths for ${validProducts.length} valid products`
    );

    const paths = validProducts.map((p) => ({
      category: p.category_slug,
      product: p.slug,
    }));

    if (paths.length > 0) {
      console.log("🛤️ Sample static paths:", paths.slice(0, 5));
    }

    return paths;
  } catch (error) {
    console.error("🔥 Error in generateStaticParams:", error);
    return [];
  }
}

// Metadata from cached data
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { category, product } = resolvedParams;

    console.log(`🏷️ Generating metadata for: ${category}/${product}`);

    const products = await getCachedProductsMeta();
    const meta = products.find(
      (p) => p.slug === product && p.category_slug === category
    );

    if (!meta) {
      console.warn(`⚠️ No metadata found for product: ${category}/${product}`);
      return {
        title: `${product} - ${category} - Pulseit Fitness`,
        description: `Shop ${product} in our ${category} collection at Pulseit Fitness`,
        robots: "noindex,nofollow",
      };
    }

    return {
      title: meta.seo_title || `${product} - ${category} - Pulseit Fitness`,
      description:
        meta.seo_description || `Shop ${product} in our ${category} collection`,
      robots: "index,follow",
      openGraph: {
        title: meta.seo_title || `${product} - Pulseit Fitness`,
        description:
          meta.seo_description || `Shop ${product} at Pulseit Fitness`,
      },
      twitter: {
        card: "summary_large_image",
        title: meta.seo_title || `${product} - Pulseit Fitness`,
        description:
          meta.seo_description || `Shop ${product} at Pulseit Fitness`,
      },
    };
  } catch (error) {
    console.error("🔥 Error generating metadata:", error);
    const { category, product } = await params;
    return {
      title: `${product} - ${category} - Pulseit Fitness`,
      description: `Shop ${product} at Pulseit Fitness`,
      robots: "index,follow",
    };
  }
}

// Enhanced product data fetching with cache tags
const getCachedProductData = unstable_cache(
  async (product: string): Promise<ProductResponse> => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/product/${product}`;

    console.log(`🔍 Fetching product data from: ${url}`);

    try {
      const res = await fetch(url, {
        next: {
          revalidate: 3600,
          tags: [`product-${product}`, "products"],
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log(`📊 Product API Response: ${res.status} ${res.statusText}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ Product API Error Details:`, {
          status: res.status,
          statusText: res.statusText,
          url,
          product,
          response: errorText,
        });

        throw new Error(
          `Failed to fetch product "${product}": ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();

      console.log(`✅ Successfully fetched product data for: ${product}`);
      return data;
    } catch (error) {
      console.error(`🔥 Detailed error fetching product "${product}":`, error);
      throw error;
    }
  },
  ["product-data"],
  {
    revalidate: 3600,
    tags: ["products"],
  }
);

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const resolvedParams = await params;
  const { category, product } = resolvedParams;

  console.log(`🎯 Rendering product page: ${category}/${product}`);

  let productData: ProductResponse;

  try {
    productData = await getCachedProductData(product);

    if (!productData?.product) {
      console.warn(
        `⚠️ Product data exists but no product object found for: ${category}/${product}`
      );
      notFound();
    }

    console.log(`✅ Successfully loaded product page: ${category}/${product}`);
  } catch (error) {
    console.error(
      `🔥 Error in product page for ${category}/${product}:`,
      error
    );
    notFound();
  }

  return <ProductPage productData={productData} />;
}
