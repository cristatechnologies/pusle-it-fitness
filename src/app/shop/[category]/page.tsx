import CategoryPage from "@/Theme/page-components/Shop/page";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface CategoryMeta {
  slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
}

// Fetch category metadata
async function fetchAllCategoriesMeta(): Promise<CategoryMeta[]> {
  try {
    // const controller = new AbortController();
    // const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const res = await fetch(
      "https://s1.shopico.in/pulseit2/api/user/metadata?product-category=true",
      // {
      //   signal: controller.signal,
      // }
    );

    // clearTimeout(timeoutId);

    if (!res.ok) throw new Error("Failed to fetch all categories metadata");
    const data = await res.json();

    const categories = data.metadata || [];
    return categories;
  } catch (error) {
    console.error("Error fetching categories metadata:", error);
    // Return empty array to prevent build failure
    return [];
  }
}

// Pre-render only valid categories
export async function generateStaticParams() {
  try {
    const categories = await fetchAllCategoriesMeta();
    const validCategories = categories.filter((c) => c.slug);

    console.log(
      `generateStaticParams: Found ${validCategories.length} valid categories`,
      validCategories.map((c) => c.slug)
    );

    return validCategories.map((c) => ({
      category: c.slug,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

async function getData(category?: string, page?: number) {
  const url = category
    ? `${
        process.env.NEXT_PUBLIC_BASE_URL
      }api/product?category=${category}&page=${page || 1}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}api/product?page=${page || 1}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const res = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("Failed to fetch data");
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(`Error fetching data for category ${category}:`, error);
    throw error; // Re-throw to handle in calling function
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  try {
    const { category } = await params;

    console.log(`[generateMetadata] Called for category: ${category}`);

    // Fetch categories metadata
    const categories = await fetchAllCategoriesMeta();
    const categoryMeta = categories.find((c) => c.slug === category);

    console.log(
      `[generateMetadata] Found ${categories.length} total categories for ${category}`
    );
    console.log(
      `[generateMetadata] Category "${category}" metadata:`,
      categoryMeta
    );

    // If category doesn't exist in metadata, return static fallback metadata
    if (!categoryMeta) {
      console.warn(
        `[generateMetadata] Category "${category}" not found in metadata`
      );

      return {
        title: "Shop Premium Fitness Equipment - Pulseit Fitness",
        description:
          "Discover high-quality fitness equipment and accessories for all your workout needs. From yoga to swimming, find everything at Pulseit Fitness.",
        robots: "index,follow",
        openGraph: {
          title: "Shop Premium Fitness Equipment - Pulseit Fitness",
          description:
            "Discover high-quality fitness equipment and accessories for all your workout needs. From yoga to swimming, find everything at Pulseit Fitness.",
          type: "website",
          siteName: "Shop Pulseit Fitness",
        },
        twitter: {
          card: "summary_large_image",
          title: "Shop Premium Fitness Equipment - Pulseit Fitness",
          description:
            "Discover high-quality fitness equipment and accessories for all your workout needs. From yoga to swimming, find everything at Pulseit Fitness.",
        },
      };
    }

    // Use static fallbacks if somehow missing.
    const title =
      categoryMeta.meta_title ||
      "Shop Premium Fitness Equipment - Pulseit Fitness";

    const description =
      categoryMeta.meta_description ||
      "Discover high-quality fitness equipment and accessories for all your workout needs. From yoga to swimming, find everything at Pulseit Fitness.";

    console.log(`[generateMetadata] Final metadata for ${category}:`, {
      title,
      description,
    });

    const metadata: Metadata = {
      title,
      description,
      robots: "index,follow",
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "Shop Pulseit Fitness",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };

    return metadata;
  } catch (error) {
    console.error(
      `[generateMetadata] Error generating metadata for category:`,
      error
    );

    // Return safe static fallback metadata instead of failing
    return {
      title: "Shop Premium Fitness Equipment - Pulseit Fitness",
      description:
        "Discover high-quality fitness equipment and accessories for all your workout needs. From yoga to swimming, find everything at Pulseit Fitness.",
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

  try {
    const currentPage = Number(page) || 1;
    const data = await getData(category, currentPage);
    return <CategoryPage data={data} categorySlug={category} />;
  } catch (error) {
    console.log("Error in Page component:", error);
    notFound();
  }
}
