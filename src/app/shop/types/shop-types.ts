// import { ActiveVariant } from "@/lib/redux/features/compare/types";



export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  status: number;
  parent_id: number | null;
  image: string;
  created_at: string;
  updated_at: string;
  hsn_code: string;
  children: Category[];
}

export interface Product {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  thumb_image: string;
  category_id: number;
  brand_id: number;
  qty: number;
  weight: string;
  sold_qty: number;
  is_external:boolean
  short_description: string;
  long_description: string;
  video_link: string | null;
  sku: string | null;
  seo_title: string;
  seo_description: string;
  price: number;
  offer_price: number | null;
  tags: string | null;
  show_homepage: number;
  is_undefine: number;
  is_featured: number;
  new_product: number;
  is_top: number;
  is_best: number;
  status: number;
  is_specification: number;
  created_at: string;
  updated_at: string;
  catalogid: number;
  height: string;
  width: string;
  hsn_code: number;
  averageRating: string;
  totalSold: string;
// You might want to define a proper type for variants too
}

export interface ProductsData {
  current_page: number;
  data: Product[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ApiResponse {
  searchCategoryArr: number[];
  searchBrandArr: number; // Replace with proper type if possible
  categories: Category[];
  brands: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  activeVariants: Array<{
    name: string;
    id: number;
    active_variant_items: Array<{
      product_variant_id: number;
      name: string;
      price: number;
      id: number;
    }>;
  }>;
  products: ProductsData;
  seoSetting: {
    id: number;
    page_name: string;
    seo_title: string;
    seo_description: string;
    created_at: string | null;
    updated_at: string;
  };
  shopPageCenterBanner: {
    product_slug: string;
    image: string;
    banner_location: string;
    status: number;
    after_product_qty: number;
    title_one: string;
  };
  shopPageSidebarBanner: {
    product_slug: string;
    image: string;
    banner_location: string;
    status: number;
    title_one: string;
    title_two: string;
  };
}
