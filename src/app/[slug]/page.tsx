import { notFound } from "next/navigation";
import type { Metadata } from "next";

import DynamicPageClient from "@/Theme/page-components/custom-page/page";

interface CustomPageMeta {
  slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keyword?: string | null;
  page_name?: string | null;
  description?: string | null;
}

export const revalidate = 3600;

let allCustomPagesCache: CustomPageMeta[] = [];

async function fetchAllCustomPagesMeta(): Promise<CustomPageMeta[]> {
  if (allCustomPagesCache.length) return allCustomPagesCache;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/metadata?custom-pages-all=true`,
    { next: { revalidate } }
  );

  if (!res.ok) throw new Error("Failed to fetch all custom pages metadata");

  const data = await res.json();
  allCustomPagesCache = data.metadata || [];
  return allCustomPagesCache;
}

export async function generateStaticParams() {
  const pages = await fetchAllCustomPagesMeta();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>; // Mark params as Promise
}): Promise<Metadata> {
  const resolvedParams = await params; // Await params first
  const pages = await fetchAllCustomPagesMeta();
  const pageMeta = pages.find((p) => p.slug === resolvedParams.slug); // Use resolvedParams

  if (!pageMeta) notFound();

  const title =
    pageMeta?.meta_title ||
    `${resolvedParams.slug.replace(/-/g, " ")} - Shop Pulseit Fitness`;
  const description =
    pageMeta?.meta_description ||
    `Read our ${resolvedParams.slug.replace(/-/g, " ")} page`;

  return {
    title,
    description,
    keywords: pageMeta?.meta_keyword || "",
    robots: "index,follow",
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params; // Await params first
  const pages = await fetchAllCustomPagesMeta();
  const pageMeta = pages.find((p) => p.slug === resolvedParams.slug); // Use resolvedParams

  if (!pageMeta) notFound();

  return <DynamicPageClient slug={resolvedParams.slug} />;
}
