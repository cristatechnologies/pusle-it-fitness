import { notFound } from "next/navigation";
import ProductPage from "@/Theme/page-components/Shop/Product-Page/page";

import { ProductResponse } from "@/Theme/types/product";

export interface ProductPageProps {
  productData: ProductResponse;
}

async function getProductData(product: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/product/${product}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  // Await the params since they're now a Promise in Next.js 15
  const resolvedParams = await params;
  let productData: ProductResponse;

  try {
    productData = await getProductData(resolvedParams.product);
    if (!productData?.product) notFound();
  } catch (error) {
    console.log("Error fetching product:", error);
    notFound();
  }

  return <ProductPage productData={productData} />;
}
