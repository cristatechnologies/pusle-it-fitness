// src/types/blog.interface.ts


//for the blog category /api/blog-category
export interface BlogCategoryResponse {
  categories: BlogCategory[];
}

export interface BlogBySlugApiResponse {
  blog: BlogPost;
  popularPosts: PopularPost[];
  categories: BlogCategory[];
  recaptchaSetting: RecaptchaSetting;
}


export interface BlogByCategoryResponse {
  blogs: {
    current_page: number;
    data: BlogPost[];
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
    prev_page_url: string | null;
    to: number;
    total: number;
    per_page: number;
  };
  seo_setting: {
    id: number;
    page_name: string;
    seo_title: string;
    seo_description: string;
    created_at: string | null;
    updated_at: string;
  };
}

export interface BlogPost {
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

export interface PopularPost {
  id: number;
  blog_id: number;
  status: number;
  created_at: string;
  updated_at: string;
  blog: BlogPost;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  status: number;
  created_at: string;
  updated_at: string;
}

interface RecaptchaSetting {
  id: number;
  site_key: string;
  secret_key: string;
  status: number;
  created_at: string | null;
  updated_at: string;
}
