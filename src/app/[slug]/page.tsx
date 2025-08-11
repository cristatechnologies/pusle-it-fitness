import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";

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
    "https://s1.shopico.in/pulseit2/api/user/metadata?custom-pages-all=true",
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const pages = await fetchAllCustomPagesMeta();
  const pageMeta = pages.find((p) => p.slug === resolvedParams.slug);

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

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const pages = await fetchAllCustomPagesMeta();
  const currentPage = pages.find((p) => p.slug === resolvedParams.slug);

  if (!currentPage) notFound();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: currentPage.page_name || "", href: `/${currentPage.slug}` },
  ];

  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="font-manrope max-w-4xl mx-auto p-4 md:p-6 min-h-[100vh]">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {currentPage.page_name}
        </h1>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: currentPage.description || "" }}
        />
      </div>
    </>
  );
}
