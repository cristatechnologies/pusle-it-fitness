import CategoryPage from "@/Theme/page-components/Shop/page";
import { notFound } from "next/navigation";

import { getPageMetadata } from "@/lib/utils/getPageMetadata";

export async function generateMetadata() {
  const meta = await getPageMetadata("shop");

  return {
    title: meta?.title || "Shop Page",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
  };
}



async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/product`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export default async function Page() {
  try {
    const data = await getData();
    return <CategoryPage data={data} />;
  } catch (error) {
    console.log(error);
    notFound();
  }
}
