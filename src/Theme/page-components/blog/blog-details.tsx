// src/Theme/page-components/blog/Blog-detail.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchBlogBySlug } from "@/services/blog";
import Image from "next/image";
import { formatDate } from "@/lib/utils/format-date";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface BlogDetailProps {
  slug: string;
}

// Use the Blog type that matches your API
interface Blog {
  id: number;
  admin_id: number;
  title: string;
  slug: string;
  blog_category_id: number;
  image: string;
  description: string;
  views: number;
  seo_title: string;
  seo_description: string;
  status: number;
  show_homepage: number;
  created_at: string;
  updated_at: string;
}

export default function BlogDetail({ slug }: BlogDetailProps) {
  const [data, setData] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const response = await fetchBlogBySlug(slug);
        setData(response);
      } catch (error) {
        console.error("Error loading blog:", error);
        setError("Failed to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  if (loading) {
    return <div />; // Create a skeleton loading component
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-medium">{error}</h2>
        <Link
          href="/blog"
          className="text-[var(--hover-color)] mt-4 inline-block"
        >
          Back to blog
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-medium">Blog post not found</h2>
        <Link
          href="/blog"
          className="text-[var(--hover-color)] mt-4 inline-block"
        >
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-manrope">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/blog"
          className="flex items-center text-sm text-gray-600 mb-6 hover:text-[var(--hover-color)]"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Blog
        </Link>

        {/* Main blog content */}
        <div className="mb-8">
          <div className="relative h-96 w-full rounded-lg overflow-hidden mb-6">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${data.image}`}
              alt={data.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              {formatDate(data.created_at)}
            </span>
            <span className="text-sm text-gray-500">{data.views} views</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-4">{data.title}</h1>
        </div>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
      </div>
    </div>
  );
}
