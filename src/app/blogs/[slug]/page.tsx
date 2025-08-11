// app/blogs/[slug]/page.tsx
import BlogDetail from "@/Theme/page-components/blog/blog-details";
import { Metadata } from "next";
import { fetchBlogBySlug } from "@/services/blog";

export const revalidate = 3600; // 1 hour

interface BlogMeta {
  slug: string;
  seo_title?: string;
  seo_description?: string;
  category_slug: string;
}

// cache variable so we don't re-fetch every call
let allBlogsCache: BlogMeta[] | null = null;

// Fetch once & cache blog metadata
async function fetchAllBlogsMeta(): Promise<BlogMeta[]> {
  if (allBlogsCache) return allBlogsCache;

  const res = await fetch(
    "https://s1.shopico.in/pulseit2/api/user/metadata?blogs-all=true",
    { next: { revalidate } }
  );

  if (!res.ok) throw new Error("Failed to fetch all blogs metadata");
  const data = await res.json();

  const blogs = data.metadata || [];
  allBlogsCache = blogs;
  return blogs;
}

// Pre-render only valid blogs
export async function generateStaticParams() {
  const blogs = await fetchAllBlogsMeta();

  const validBlogs = blogs.filter((b) => b.slug);

  console.log("Static blog paths count:", validBlogs.length);

  return validBlogs.map((b) => ({
    slug: b.slug,
  }));
}

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

    // Get blog metadata from the metadata API first
    const blogs = await fetchAllBlogsMeta();
    console.log("blogs metadata", blogs);
    console.log("params data", resolvedParams.slug);

    const blogMeta = blogs.find((b) => b.slug === resolvedParams.slug);

    // Fallback: fetch full blog data if metadata API doesn't have the data
    let fallbackBlogData = null;
    if (!blogMeta?.seo_title && !blogMeta?.seo_description) {
      try {
        fallbackBlogData = await fetchBlogBySlug(resolvedParams.slug);
        console.log("blog fallback data", fallbackBlogData);
      } catch (error) {
        console.log("Failed to fetch fallback blog data:", error);
      }
    }

    // Create title from slug if no seo_title (convert kebab-case to Title Case)
    const fallbackTitle = resolvedParams.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Use metadata API first, then fallback to existing blog data, then default values
    const title =
      blogMeta?.seo_title ||
      fallbackBlogData?.blog?.seo_title ||
      fallbackBlogData?.blog?.title ||
      fallbackTitle;

    const description =
      blogMeta?.seo_description ||
      fallbackBlogData?.blog?.seo_description ||
      fallbackBlogData?.blog?.description?.substring(0, 160) ||
      `Read our blog post about ${fallbackTitle}`;

    const baseMetadata: Metadata = {
      title,
      description,
      alternates: {
        canonical: `/blogs/${resolvedParams.slug}`,
      },
      robots: "index,follow",
    };

    // Enhanced metadata if we have full blog data
    if (fallbackBlogData?.blog) {
      return {
        ...baseMetadata,
        openGraph: {
          title,
          description,
          url: `/blogs/${resolvedParams.slug}`,
          type: "article",
          publishedTime: fallbackBlogData.blog.created_at,
          modifiedTime: fallbackBlogData.blog.updated_at,
          images: fallbackBlogData.blog.image
            ? [
                {
                  url: `${process.env.NEXT_PUBLIC_BASE_URL}${fallbackBlogData.blog.image}`,
                  width: 1200,
                  height: 630,
                  alt: fallbackBlogData.blog.title || title,
                },
              ]
            : [],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: fallbackBlogData.blog.image
            ? [
                `${process.env.NEXT_PUBLIC_BASE_URL}${fallbackBlogData.blog.image}`,
              ]
            : [],
        },
      };
    }

    // Basic metadata if only metadata API data is available
    return {
      ...baseMetadata,
      openGraph: {
        title,
        description,
        url: `/blogs/${resolvedParams.slug}`,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
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
