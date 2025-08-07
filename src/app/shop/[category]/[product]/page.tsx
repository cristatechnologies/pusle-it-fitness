import { notFound } from "next/navigation";
import ProductPage from "@/Theme/page-components/Shop/Product-Page/page";
import { Metadata } from "next";
import { ProductResponse } from "@/Theme/types/product";

export interface ProductPageProps {
  productData: ProductResponse;
}



async function getProductData(product: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/product/${product}`,
   
  );

  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}



export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    const productData: ProductResponse = await getProductData(
      resolvedParams.product
    );

    if (!productData?.product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    const { seo_title, seo_description, thumb_image, name, short_description } =
      productData.product;

    return {
      title: seo_title || name,
      description: seo_description || short_description,
      openGraph: {
        title: seo_title || name,
        description: seo_description || short_description,
        images: thumb_image
          ? [`${process.env.NEXT_PUBLIC_BASE_URL}${thumb_image}`]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: seo_title || name,
        description: seo_description || short_description,
        images: thumb_image
          ? [`${process.env.NEXT_PUBLIC_BASE_URL}${thumb_image}`]
          : [],
      },
    };
  } catch (error) {
    console.log("Error generating metadata:", error);
    return {
      title: "Product",
      description: "Product page",
    };
  }
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
