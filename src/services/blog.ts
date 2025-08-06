// src/services/blog.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ;

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Blog {
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

export interface BlogResponse {
  blogs: {
    current_page: number;
    data: Blog[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  seoSetting: {
    id: number;
    page_name: string;
    seo_title: string;
    seo_description: string;
    created_at: string | null;
    updated_at: string;
  };
}

export interface BlogCategoryResponse {
  categories: BlogCategory[];
}

export const fetchBlogCategories = async (): Promise<BlogCategoryResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/blog-category`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    throw error;
  }
};

export const fetchBlogs = async (
  page = 1,
  categoryId?: number
): Promise<BlogResponse> => {
  try {
    const url = categoryId
      ? `${API_BASE_URL}api/blog?page=${page}&category=${categoryId}`
      : `${API_BASE_URL}api/blog?page=${page}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const fetchBlogBySlug = async (slug: string): Promise<Blog> => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/blog/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    throw error;
  }
};




export const searchBlogs = async (
  query: string,
  page = 1,
  categoryId?: number
): Promise<BlogResponse> => {
  try {
    let url = `${API_BASE_URL}api/blog?page=${page}&search=${encodeURIComponent(query)}`;
    if (categoryId) {
      url += `&category_id=${categoryId}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error searching blogs:", error);
    throw error;
  }
};