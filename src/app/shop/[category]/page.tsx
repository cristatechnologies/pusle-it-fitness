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

  const res = await fetch(
    "https://s1.shopico.in/pulseit2/api/user/metadata?product-category=true",
    { next: { revalidate } }
  );

  if (!res.ok) throw new Error("Failed to fetch all categories metadata");
  const data = await res.json();

  const categories = data.metadata || [];
  allCategoriesCache = categories;
  return categories;
}

// Pre-render only valid categories
export async function generateStaticParams() {
  const categories = await fetchAllCategoriesMeta();

  const validCategories = categories.filter((c) => c.slug);

  return validCategories.map((c) => ({
    category: c.slug,
  }));
}

async function getData(category?: string, page?: number) {
  const url = category
    ? `${
        process.env.NEXT_PUBLIC_BASE_URL
      }api/product?category=${category}&page=${page || 1}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}api/product?page=${page || 1}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) throw new Error("Failed to fetch data");
  const data = await res.json();

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params; // ✅ Await the promise
  try {
    const categories = await fetchAllCategoriesMeta();
    const categoryMeta = categories.find((c) => c.slug === category);

    let fallbackSeoSetting = null;
    if (!categoryMeta?.meta_title && !categoryMeta?.meta_description) {
      try {
        const data = await getData(category);
        fallbackSeoSetting = data.seoSetting;
      } catch (error) {
        console.log("Failed to fetch fallback SEO data:", error);
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

    return {
      title,
      description,
      robots: "index,follow",
      openGraph: { title, description },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Shop Pulseit Fitness",
      description: "Shop Pulseit Fitness",
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
  const { category } = await params; // ✅
  const { page } = await searchParams; // ✅

  try {
    const currentPage = Number(page) || 1;
    const data = await getData(category, currentPage);
    return <CategoryPage data={data} categorySlug={category} />;
  } catch (error) {
    console.log(error);
    notFound();
  }
}
