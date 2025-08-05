import { ActiveVariant } from "../compare/types";

// features/homepage/types.ts
export interface SectionTitle {
  key: string;
  default: string;
  custom: string;
}

export interface SeoSetting {
  id: number;
  page_name: string;
  seo_title: string;
  seo_description: string;
  created_at: string | null;
  updated_at: string;
}

export interface Slider {
  id: number;
  badge: string | null;
  title_one: string | null;
  title_two: string | null;
  image: string;
  status: number;
  serial: number;
  slider_location: string | null;
  product_slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: number;
  product_slug: string;
  image: string;
  banner_location: string;
  title_one?: string;
  title_two?: string;
  badge?: string;
  status: number;
  header?: string;
  title?: string;
  play_store?: string | null;
  app_store?: string;
}

export interface Service {
  id: number;
  title: string;
  icon: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  image: string;
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
  active_variants?: ActiveVariant[];
  category?: Category[];
}

export interface Category {
  id: number;
  slug: string;
  name?: string;
  icon?: string;
  status?: number;
  parent_id?: number | null;
  image?: string;
  created_at?: string;
  updated_at?: string;
  hsn_code?: string;
}

export type PopularCategoryProducts = Product[];
export interface CategoryWithProducts {
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
  products: Product[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface FlashSale {
  id: number;
  title: string;
  homepage_image: string;
  flashsale_page_image: string;
  end_time: string;
  offer: number;
  status: number;
  created_at: string | null;
  updated_at: string;
}


export interface FeaturedCategory {
  id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  category: Category;
}

export interface HomepageResponse {
  section_title: SectionTitle[];
  seoSetting: SeoSetting;
  sliderVisibilty: boolean;
  sliders: Slider[];
  sliderBannerOne: Banner;
  sliderBannerTwo: Banner;
  serviceVisibilty: boolean;
  services: Service[];
  homepage_categories: HomepageCategory[];
  popularCategorySidebarBanner: string;
  popularCategoryVisibilty: boolean;
  popularCategories: CategoryWithProducts[];
  popularCategoryProducts: CategoryWithProducts[];
  brandVisibility: boolean;
  brands: Brand[];
  flashSale: FlashSale;
  flashSaleSidebarBanner: Banner;
  topRatedVisibility: boolean;
  topRatedProducts: CategoryWithProducts[];
  sellerVisibility: boolean;
  twoColumnBannerOne: Banner;
  twoColumnBannerTwo: Banner;
  featuredProductVisibility: boolean;
  featuredCategorySidebarBanner: string;
  featuredCategories: FeaturedCategory[];
  featuredCategoryProducts: CategoryWithProducts[];
  singleBannerOne: Banner;
  newArrivalProductVisibility: boolean;
  newArrivalProducts: CategoryWithProducts[];
  bestProductVisibility: boolean;
  singleBannerTwo: Banner;
  bestProducts: CategoryWithProducts[];
  subscriptionBanner: Banner;
}

export interface HomepageState {
  data: HomepageResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
