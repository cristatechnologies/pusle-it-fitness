import CategoryPage from "@/Theme/page-components/Shop/page";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600; // 1 hour

interface CategoryMeta {
  slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
}

// cache variable so we don't re-fetch every call
let allCategoriesCache: CategoryMeta[] | null = null;

// Fetch once & cache category metadata
async function fetchAllCategoriesMeta(): Promise<CategoryMeta[]> {
  if (allCategoriesCache) return allCategoriesCache;

  console.log("🔍 Fetching all categories metadata...");

  try {
    const res = await fetch(
      "https://s1.shopico.in/pulseit2/api/user/metadata?product-category=true",
      { next: { revalidate } }
    );

    console.log(
      `📊 Categories Metadata API Response: ${res.status} ${res.statusText}`
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `❌ Categories Metadata API Error (${res.status}):`,
        errorText
      );
      throw new Error(
        `Failed to fetch all categories metadata: ${res.status} - ${errorText}`
      );
    }

    const data = await res.json();
    const categories = data.metadata || [];

    console.log(
      `✅ Successfully fetched ${categories.length} categories metadata`
    );

    // Log some sample categories for debugging
    if (categories.length > 0) {
      console.log(
        "📝 Sample categories:",
        categories.slice(0, 3).map((c: CategoryMeta) => ({
          slug: c.slug,
          has_meta_title: !!c.meta_title,
          has_meta_description: !!c.meta_description,
        }))
      );
    }

    allCategoriesCache = categories;
    return categories;
  } catch (error) {
    console.error("🔥 Error fetching categories metadata:", error);
    throw error;
  }
}

// Pre-render only valid categories
export async function generateStaticParams() {
  try {
    console.log("🚀 Generating static params for categories...");
    const categories = await fetchAllCategoriesMeta();

    const validCategories = categories.filter((c) => {
      const isValid = !!c.slug;
      if (!isValid) {
        console.warn("⚠️  Invalid category filtered out:", {
          slug: c.slug,
          meta_title: c.meta_title,
          meta_description: c.meta_description,
        });
      }
      return isValid;
    });

    console.log(
      `📦 Generating static paths for ${validCategories.length} valid categories`
    );

    // Log first few paths for debugging
    const paths = validCategories.map((c) => ({
      category: c.slug,
    }));

    if (paths.length > 0) {
      console.log("🛤️  Sample category paths:", paths.slice(0, 5));
    }

    return paths;
  } catch (error) {
    console.error("🔥 Error in generateStaticParams for categories:", error);
    return []; // Return empty array to prevent build failure
  }
}

async function getData(category?: string, page?: number) {
  const url = category
    ? `${
        process.env.NEXT_PUBLIC_BASE_URL
      }api/product?category=${category}&page=${page || 1}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}api/product?page=${page || 1}`;

  console.log(`🔍 Fetching category data from: ${url}`);
  console.log(`📝 Category: "${category}", Page: ${page || 1}`);
  console.log(`🌐 Base URL: ${process.env.NEXT_PUBLIC_BASE_URL}`);

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log(`📊 Category API Response: ${res.status} ${res.statusText}`);
    console.log(`🔗 Request URL: ${res.url}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Category API Error Details:`, {
        status: res.status,
        statusText: res.statusText,
        url,
        category,
        page: page || 1,
        headers: Object.fromEntries(res.headers.entries()),
        response: errorText,
      });

      throw new Error(
        `Failed to fetch category data "${category}": ${res.status} ${res.statusText}. ` +
          `URL: ${url}. Response: ${errorText}`
      );
    }

    const data = await res.json();

    console.log(
      `✅ Successfully fetched category data for: ${
        category || "all products"
      }`,
      {
        hasProducts: !!data?.products,
        productsCount: data?.products?.length || 0,
        hasSeoSetting: !!data?.seoSetting,
        totalPages: data?.totalPages || "unknown",
        currentPage: data?.currentPage || page || 1,
      }
    );

    return data;
  } catch (error) {
    console.error(`🔥 Detailed error fetching category "${category}":`, {
      url,
      category,
      page: page || 1,
      errorName: error instanceof Error ? error.name : "Unknown",
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    });

    // Re-throw with more context
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch category "${category}": ${errorMessage}`);
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  try {
    const { category } = await params;
    console.log(`🏷️  Generating metadata for category: ${category}`);

    const categories = await fetchAllCategoriesMeta();
    const categoryMeta = categories.find((c) => c.slug === category);

    if (!categoryMeta) {
      console.warn(`⚠️  No metadata found for category: ${category}`);
      console.log(`🔍 Available categories count: ${categories.length}`);
    } else {
      console.log(`✅ Found metadata for category ${category}:`, {
        has_meta_title: !!categoryMeta.meta_title,
        has_meta_description: !!categoryMeta.meta_description,
      });
    }

    let fallbackSeoSetting = null;
    if (!categoryMeta?.meta_title && !categoryMeta?.meta_description) {
      console.log(
        `🔄 No meta tags found, fetching fallback SEO data for: ${category}`
      );
      try {
        const data = await getData(category);
        fallbackSeoSetting = data.seoSetting;
        console.log(`✅ Got fallback SEO data:`, {
          has_seo_title: !!fallbackSeoSetting?.seo_title,
          has_seo_description: !!fallbackSeoSetting?.seo_description,
        });
      } catch (error) {
        console.error(
          `❌ Failed to fetch fallback SEO data for ${category}:`,
          error instanceof Error ? error.message : String(error)
        );
      }
    }

    const title =
      categoryMeta?.meta_title ||
      fallbackSeoSetting?.seo_title ||
      `${
        category.charAt(0).toUpperCase() + category.slice(1)
      } - Shop Pulseit Fitness`;

    const description =
      categoryMeta?.meta_description ||
      fallbackSeoSetting?.seo_description ||
      `Browse our ${category} collection - Shop Pulseit Fitness`;

    console.log(`📋 Generated metadata for ${category}:`, {
      titleSource: categoryMeta?.meta_title
        ? "meta"
        : fallbackSeoSetting?.seo_title
        ? "fallback"
        : "default",
      descriptionSource: categoryMeta?.meta_description
        ? "meta"
        : fallbackSeoSetting?.seo_description
        ? "fallback"
        : "default",
    });

    return {
      title,
      description,
      robots: "index,follow",
      openGraph: { title, description },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch (error) {
    console.error(
      "🔥 Error generating category metadata:",
      error instanceof Error ? error.message : String(error)
    );
    const { category } = await params;
    return {
      title: `${category} - Shop Pulseit Fitness`,
      description: `Browse our ${category} collection - Shop Pulseit Fitness`,
      robots: "index,follow",
    };
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  const { page } = await searchParams;

  console.log(`🎯 Rendering category page: ${category}, page: ${page || 1}`);

  try {
    const currentPage = Number(page) || 1;
    console.log(`📄 Processing page number: ${currentPage}`);

    const data = await getData(category, currentPage);

    if (!data) {
      console.warn(
        `⚠️  No data returned for category: ${category}, page: ${currentPage}`
      );
      notFound();
    }

    console.log(
      `✅ Successfully loaded category page: ${category}, page: ${currentPage}`
    );

    return <CategoryPage data={data} categorySlug={category} />;
  } catch (error) {
    console.error(`🔥 Error in category page for ${category}:`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      params: { category, page: page || 1 },
    });
    notFound();
  }
}
