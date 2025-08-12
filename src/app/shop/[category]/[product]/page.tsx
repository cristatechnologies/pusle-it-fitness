import { notFound } from "next/navigation";
import ProductPage from "@/Theme/page-components/Shop/Product-Page/page";
import type { Metadata } from "next";
import type { ProductResponse } from "@/Theme/types/product";

export const revalidate = 3600; // 1 hour

interface ProductMeta {
  slug: string;
  seo_title?: string;
  seo_description?: string;
  category_slug: string;
}

// cache variable so we don't re-fetch every call
let allProductsCache: ProductMeta[] | null = null;

// Fetch once & cache
async function fetchAllProductsMeta(): Promise<ProductMeta[]> {
  if (allProductsCache) return allProductsCache;

  console.log('🔍 Fetching all products metadata...');

  try {
    const res = await fetch(
      "https://s1.shopico.in/pulseit2/api/user/metadata?product-all=true",
      { next: { revalidate } }
    );

    console.log(`📊 Metadata API Response: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Metadata API Error (${res.status}):`, errorText);
      throw new Error(`Failed to fetch all products metadata: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    const products = data.metadata || [];
    
    console.log(`✅ Successfully fetched ${products.length} products metadata`);
    
    // Log some sample products for debugging
    if (products.length > 0) {
      console.log('📝 Sample products:', products.slice(0, 3).map((p: ProductMeta) => ({
        slug: p.slug,
        category_slug: p.category_slug,
        has_seo_title: !!p.seo_title
      })));
    }

    allProductsCache = products;
    return products;
  } catch (error) {
    console.error('🔥 Error fetching products metadata:', error);
    throw error;
  }
}

// Pre-render only valid products
export async function generateStaticParams() {
  try {
    console.log('🚀 Generating static params for products...');
    const products = await fetchAllProductsMeta();

    const validProducts = products.filter((p) => {
      const isValid = p.category_slug && p.slug;
      if (!isValid) {
        console.warn('⚠️  Invalid product filtered out:', {
          slug: p.slug,
          category_slug: p.category_slug,
          seo_title: p.seo_title
        });
      }
      return isValid;
    });

    console.log(`📦 Generating static paths for ${validProducts.length} valid products`);
    
    // Log first few paths for debugging
    const paths = validProducts.map((p) => ({
      category: p.category_slug,
      product: p.slug,
    }));
    
    if (paths.length > 0) {
      console.log('🛤️  Sample static paths:', paths.slice(0, 5));
    }

    return paths;
  } catch (error) {
    console.error('🔥 Error in generateStaticParams:', error);
    return []; // Return empty array to prevent build failure
  }
}

// Metadata from pre-fetched data
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { category, product } = resolvedParams;
    
    console.log(`🏷️  Generating metadata for: ${category}/${product}`);
    
    const products = await fetchAllProductsMeta();
    const meta = products.find(
      (p) => p.slug === product && p.category_slug === category
    );

    if (!meta) {
      console.warn(`⚠️  No metadata found for product: ${category}/${product}`);
      console.log(`🔍 Available products count: ${products.length}`);
      
      return {
        title: `${product} - ${category} - Pulseit Fitness`,
        description: `Shop ${product} in our ${category} collection at Pulseit Fitness`,
        robots: "noindex,nofollow", // Don't index missing products
      };
    }

    console.log(`✅ Found metadata for ${category}/${product}:`, {
      has_seo_title: !!meta.seo_title,
      has_seo_description: !!meta.seo_description
    });

    return {
      title: meta.seo_title || `${product} - ${category} - Pulseit Fitness`,
      description: meta.seo_description || `Shop ${product} in our ${category} collection`,
      robots: "index,follow",
      openGraph: {
        title: meta.seo_title || `${product} - Pulseit Fitness`,
        description: meta.seo_description || `Shop ${product} at Pulseit Fitness`,
      },
      twitter: {
        card: "summary_large_image",
        title: meta.seo_title || `${product} - Pulseit Fitness`,
        description: meta.seo_description || `Shop ${product} at Pulseit Fitness`,
      },
    };
  } catch (error) {
    console.error('🔥 Error generating metadata:', error);
    const { category, product } = await params;
    return {
      title: `${product} - ${category} - Pulseit Fitness`,
      description: `Shop ${product} at Pulseit Fitness`,
      robots: "index,follow",
    };
  }
}

// Enhanced product data fetching with detailed error logging
async function getProductData(product: string): Promise<ProductResponse> {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/product/${product}`;
  
  console.log(`🔍 Fetching product data from: ${url}`);
  console.log(`📝 Product slug: "${product}"`);
  console.log(`🌐 Base URL: ${process.env.NEXT_PUBLIC_BASE_URL}`);

  try {
    const res = await fetch(url, { 
      next: { revalidate },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    console.log(`📊 Product API Response: ${res.status} ${res.statusText}`);
    console.log(`🔗 Request URL: ${res.url}`);
    
    if (!res.ok) {
      // Get the full error response
      const errorText = await res.text();
      console.error(`❌ Product API Error Details:`, {
        status: res.status,
        statusText: res.statusText,
        url,
        product,
        headers: Object.fromEntries(res.headers.entries()),
        response: errorText
      });
      
      throw new Error(
        `Failed to fetch product "${product}": ${res.status} ${res.statusText}. ` +
        `URL: ${url}. Response: ${errorText}`
      );
    }

    const data = await res.json();
    
    console.log(`✅ Successfully fetched product data for: ${product}`, {
      hasProduct: !!data?.product,
      productId: data?.product?.id,
      productTitle: data?.product?.title
    });

    return data;

  } catch (error) {
    console.error(`🔥 Detailed error fetching product "${product}":`, {
      url,
      product,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL
    });
    
    // Re-throw with more context
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch product "${product}": ${errorMessage}`);
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const resolvedParams = await params;
  const { category, product } = resolvedParams;
  
  console.log(`🎯 Rendering product page: ${category}/${product}`);
  
  let productData: ProductResponse;

  try {
    productData = await getProductData(product);
    
    if (!productData?.product) {
      console.warn(`⚠️  Product data exists but no product object found for: ${category}/${product}`, {
        dataKeys: productData ? Object.keys(productData) : 'No data',
        productValue: productData?.product
      });
      notFound();
    }

    console.log(`✅ Successfully loaded product page: ${category}/${product}`);
    
  } catch (error) {
    console.error(`🔥 Error in product page for ${category}/${product}:`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      params: { category, product }
    });
    notFound();
  }

  return <ProductPage productData={productData} />;
}