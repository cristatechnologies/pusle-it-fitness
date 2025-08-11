// src/Theme/page-components/blog/BlogList.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  fetchBlogCategories,
  fetchBlogs,

  searchBlogs,
} from "@/services/blog";
import { BlogCategoryResponse,BlogByCategoryResponse } from "@/types/blog.interface";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils/format-date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Search } from "lucide-react";
import axios from "axios";

interface PaginationData {
  currentPage: number;
  lastPage: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

export default function BlogList() {
  const [categories, setCategories] = useState<BlogCategoryResponse>();
  const [blogs, setBlogs] = useState<BlogByCategoryResponse>();
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    lastPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesData = await fetchBlogCategories();
        setCategories(categoriesData);

        // Check if category is in URL params
        const categoryIdFromParam = categoryParam
          ? categoriesData.categories.find((cat) => cat.slug === categoryParam)
              ?.id
          : null;

        // Fetch blogs
        const blogsData = await fetchBlogs(1, categoryIdFromParam || undefined);
        setBlogs(blogsData);
        setPagination({
          currentPage: blogsData.blogs.current_page,
          lastPage: blogsData.blogs.last_page,
          nextPageUrl: blogsData.blogs.next_page_url,
          prevPageUrl: blogsData.blogs.prev_page_url,
        });

        if (categoryIdFromParam) {
          setSelectedCategory(categoryIdFromParam);
        }
      } catch (error) {
        console.error("Error loading blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryParam]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const blogsData = await searchBlogs(
        searchQuery,
        1,
        selectedCategory || undefined
      );
      setBlogs(blogsData);
      setPagination({
        currentPage: blogsData.blogs.current_page,
        lastPage: blogsData.blogs.last_page,
        nextPageUrl: blogsData.blogs.next_page_url,
        prevPageUrl: blogsData.blogs.prev_page_url,
      });
    } catch (error) {
      console.error("Error searching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update the handleCategorySelect to include search
  const handleCategorySelect = async (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    try {
      const blogsData = searchQuery
        ? await searchBlogs(searchQuery, 1, categoryId || undefined)
        : await fetchBlogs(1, categoryId || undefined);

      setBlogs(blogsData);
      setPagination({
        currentPage: blogsData.blogs.current_page,
        lastPage: blogsData.blogs.last_page,
        nextPageUrl: blogsData.blogs.next_page_url,
        prevPageUrl: blogsData.blogs.prev_page_url,
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (pageUrl: string) => {
    if (!pageUrl) return;
    setLoading(true);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}${pageUrl}`);
      if (searchQuery) {
        url.searchParams.set("search", searchQuery);
      }
      const response = await axios.get(url.toString());
      const blogsData = response.data;
      setBlogs(blogsData.blogs.data);
      setPagination({
        currentPage: blogsData.blogs.current_page,
        lastPage: blogsData.blogs.last_page,
        nextPageUrl: blogsData.blogs.next_page_url,
        prevPageUrl: blogsData.blogs.prev_page_url,
      });
    } catch (error) {
      console.error("Error changing page:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-manrope">
      <div className="mb-8 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg p-6 sticky top-8">
            <h3 className="text-lg font-semibold mb-4">CATEGORIES</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`text-left w-full py-2 px-3 ${
                    !selectedCategory
                      ? "bg-gray-100 font-medium"
                      : "hover:bg-gray-50"
                  }`}
                >
                  All Categories
                </button>
              </li>
              {categories?.categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategorySelect(category.id)}
                    className={`text-left w-full py-2 px-3 ${
                      selectedCategory === category.id
                        ? "bg-gray-100 font-medium"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="lg:col-span-3">
          {blogs?.blogs.data.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">
                {searchQuery
                  ? `No results found for "${searchQuery}"`
                  : selectedCategory
                  ? `No posts in this category yet.`
                  : `No blog posts available.`}
              </h3>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    handleCategorySelect(selectedCategory);
                  }}
                  className="mt-4 text-[var(--hover-color)]"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogs?.blogs.data.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white shadow-sm rounded-lg overflow-hidden"
                  >
                    <Link href={`/blogs/${blog.slug}`}>
                      <div className="relative h-48 w-full">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${blog.image}`}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(blog.created_at)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {blog.views} views
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 hover:text-[var(--hover-color)]">
                          {blog.title}
                        </h3>
                        <div
                          className="text-gray-600 text-sm line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: blog.description }}
                        />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.lastPage > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        pagination.prevPageUrl &&
                        handlePageChange(pagination.prevPageUrl)
                      }
                      disabled={!pagination.prevPageUrl}
                      className={`p-2 rounded-md ${
                        !pagination.prevPageUrl
                          ? "text-gray-300"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from(
                      { length: pagination.lastPage },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() =>
                          handlePageChange(
                            `api/blog?page=${page}${
                              selectedCategory
                                ? `&category_id=${selectedCategory}`
                                : ""
                            }`
                          )
                        }
                        className={`w-10 h-10 flex items-center justify-center rounded-md ${
                          pagination.currentPage === page
                            ? "bg-black text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        pagination.nextPageUrl &&
                        handlePageChange(pagination.nextPageUrl)
                      }
                      disabled={!pagination.nextPageUrl}
                      className={`p-2 rounded-md ${
                        !pagination.nextPageUrl
                          ? "text-gray-300"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
