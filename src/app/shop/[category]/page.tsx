import CategoryPage from "@/Theme/page-components/Shop/page";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

async function getData(category?: string) {
  const url = category
    ? `${process.env.NEXT_PUBLIC_BASE_URL}api/product?category=${category}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}api/product`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) throw new Error("Failed to fetch data");
  const data = await res.json();

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> 
{
  // Await the params since they're now a Promise in Next.js 15
  const resolvedParams = await params;

  try {
    const data = await getData(resolvedParams.category);
    const seoSetting = data.seoSetting;


    console.log("category page seo",seoSetting)
    return {
      title: seoSetting?.seo_title || "Shop  Fitness",
      description: seoSetting?.seo_description || "Shop Pulseit Fitness",
      robots: "index,follow",
      
      // openGraph: {
      //   title: seoSetting?.seo_title || "Shop Pulseit Fitness",
      //   description: seoSetting?.seo_description || "Shop Pulseit Fitness",
      //   // Add other OG tags as needed
      // },
      // twitter: {
      //   card: 'summary_large_image',
      //   title: seoSetting?.seo_title || "Shop Pulseit Fitness",
      //   description: seoSetting?.seo_description || "Shop Pulseit Fitness",
      //   // Add other Twitter tags as needed
      // },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Shop Pulseit Fitness",
      description: "Shop Pulseit Fitness",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  // Await the params since they're now a Promise in Next.js 15
  const resolvedParams = await params;

  try {
    const data = await getData(resolvedParams.category);
    return <CategoryPage data={data} categorySlug={resolvedParams?.category} />;
  } catch (error) {
    console.log(error);
    notFound();
  }
}
