import CategoryPage from "@/Theme/page-components/Shop/page";
import { notFound } from "next/navigation";

async function getData(category?: string) {
  const url = category
    ? `${process.env.NEXT_PUBLIC_BASE_URL}api/product?category=${category}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}api/product`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) throw new Error("Failed to fetch data");
  const data = await res.json();

  return data;
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
