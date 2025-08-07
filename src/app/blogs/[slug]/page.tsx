// app/blog/[slug]/page.tsx
import BlogDetail from "@/Theme/page-components/blog/blog-details";
import { Metadata } from "next";
import { fetchBlogBySlug } from "@/services/blog";

// Update the interface to match Next.js 15 expectations
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    // Await the params in Next.js 15
    const resolvedParams = await params;
    const data = await fetchBlogBySlug(resolvedParams.slug);

    return {
      title: data.blog.seo_title || data.blog.title,
      description:
        data.blog.seo_description || data.blog.description.substring(0, 160),
      alternates: {
        canonical: `/blog/${resolvedParams.slug}`,
      },
      openGraph: {
        title: data.blog.seo_title || data.blog.title,
        description:
          data.blog.seo_description || data.blog.description.substring(0, 160),
        url: `/blog/${resolvedParams.slug}`,
        type: "article",
        publishedTime: data.blog.created_at,
        modifiedTime: data.blog.updated_at,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}${data.blog.image}`,
            width: 1200,
            height: 630,
            alt: data.blog.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: data.blog.seo_title || data.blog.title,
        description:
          data.blog.seo_description || data.blog.description.substring(0, 160),
        images: [`${process.env.NEXT_PUBLIC_BASE_URL}${data.blog.image}`],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post",
      description: "Read our latest blog post",
    };
  }
}

export default async function Page({ params }: PageProps) {
  // Await the params since they're now a Promise in Next.js 15
  const resolvedParams = await params;
  return <BlogDetail slug={resolvedParams.slug} />;
}
