// features/website/types.ts

export interface CatalogMode {
  id: number;
  status: number;
  show_price: number;
  created_at: string | null;
  updated_at: string;
}

export interface LanguageSettings {
  [key: string]: string;
}

export interface AppSettings {
  id: number;
  primary_color: string;
  secondary_color: string;
  primary_text_color: string;
  secondary_text_color: string;
  button_primary_color: string;
  button_secondary_color: string;
  appbar_color: string;
  appbar_text_color: string;
  appbar_text_size: number;
  bottombar_color: string;
  bottombar_text_color: string;
  bottombar_text_size: number;
  created_at: string | null;
  updated_at: string;
}

export interface ProductCategory {
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
  children: ProductCategory[];
}

// features/website/types.ts

// Existing interfaces remain the same...

export interface FlashSale {
  status: number;
  offer: number;
  end_time: string;
}

export interface GoogleAnalytic {
  id: number;
  analytic_id: string;
  status: number;
  created_at: string | null;
  updated_at: string;
}

export interface AnnouncementModal {
  id: number;
  status: number;
  title: string;
  description: string;
  image: string;
  expired_date: number;
  created_at: string | null;
  updated_at: string;
}

export interface CustomPage {
  id: number;
  page_name: string;
  slug: string;
  description: string;
  status: number;
  page_section: number;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  type: number;
  image: string | null;
  "blog_category_id ": string | null;
  views: number | null;
  breadcrumb_image: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  children: CustomPage[];
  blog_category: null;
}

export interface MegaMenuCategory {
  id: number;
  category_id: number;
  status: number;
  serial: number;
  created_at: string;
  updated_at: string;
  category: {
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
  };
}

export interface MegaMenuBanner {
  id: number;
  header: string | null;
  title: string | null;
  link: string;
  image: string;
  banner_location: string;
  after_product_qty: number;
  status: number;
  created_at: string | null;
  updated_at: string;
  title_one: string;
  title_two: string;
  badge: string | null;
  product_slug: string;
}

export interface CookieConsent {
  id: number;
  status: number;
  border: string;
  corners: string;
  background_color: string;
  text_color: string;
  border_color: string;
  btn_bg_color: string;
  btn_text_color: string;
  message: string;
  link_text: string;
  btn_text: string;
  link: string | null;
  created_at: string | null;
  updated_at: string;
}

export interface FooterColumnLink {
  id: number;
  column: string;
  link: string;
  title: string;
  custom_page_id: number;
  created_at: string;
  updated_at: string;
}

export interface FooterColumn {
  col_links: FooterColumnLink[];
  columnTitle: string;
}

export interface FooterData {
  footer_first_col: FooterColumn;
  footer_second_col: FooterColumn;
  footer_third_col: FooterColumn;
  footer: {
    id: number;
    about_us: string;
    phone: string;
    email: string;
    address: string;
    first_column: string;
    second_column: string;
    third_column: string;
    copyright: string;
    payment_image: string;
    created_at: string | null;
    updated_at: string;
  };
}

export interface ImageContent {
  empty_cart: string;
  empty_wishlist: string;
  change_password_image: string;
  become_seller_avatar: string;
  become_seller_banner: string;
  login_image: string;
  error_page: string;
  breadcrumb_images: string;
}

export interface PusherInfo {
  id: number;
  app_id: string;
  app_key: string;
  app_secret: string;
  app_cluster: string;
  created_at: string | null;
  updated_at: string;
}

export interface WorkingHour {
  active: boolean;
  start: string;
  end: string;
}

export interface WorkingHours {
  monday: WorkingHour;
  tuesday: WorkingHour;
  wednesday: WorkingHour;
  thursday: WorkingHour;
  friday: WorkingHour;
  saturday: WorkingHour;
  sunday: WorkingHour;
}export interface settings {
  logo: string;
  favicon: string;
  working_hours: WorkingHours;
  enable_user_register: number;
  phone_number_required: number;
  default_phone_code: string;
  text_direction: string;
  timezone: string;
  store_name: string;
  topbar_phone: string;
  topbar_email: string;
  currency_icon: string;
  currency_name: string;
  show_product_progressbar: number;
  primary_color: string;
  secondary_color: string;
  selected_theme: string;
  secondary_text_color: string;
  primary_text_color: string;
  header_color: string;
  header_text_color: string;
  topbar_color: string;
  footer_color: string;
  footer_text_color: string;
  hover_color: string;
}

// Update the WebsiteSetupResponse interface to include all properties
export interface WebsiteSetupResponse {
  language: LanguageSettings;
  setting: settings;
  catalog_mode: CatalogMode;
  app_setting: AppSettings;
  maintainance: {
    id: number;
    status: number;
    image: string;
    description: string;
    created_at: string | null;
    updated_at: string;
  };
  productCategories: ProductCategory[];
  seo_setting: Array<{
    id: number;
    page_name: string;
    seo_title: string;
    seo_description: string;
    created_at: string | null;
    updated_at: string;
  }>;
  social_links: Array<{
    id: number;
    link: string;
    icon: string;
    created_at: string;
    updated_at: string;
  }>;
  flashSaleActive: boolean;
  flashSale: FlashSale;
  flashSaleProducts: []; // You might want to define a proper type for products
  googleAnalytic: GoogleAnalytic;
  announcementModal: AnnouncementModal;
  customPages: CustomPage[];
  megaMenuCategories: MegaMenuCategory[];
  megaMenuBanner: MegaMenuBanner;
  cookie_consent: CookieConsent;
  filter_price_range: number;
  footer: FooterData;
  image_content: ImageContent;
  pusher_info: PusherInfo;
}

// WebsiteState remains the same...
export interface WebsiteState {
  data: WebsiteSetupResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  baseData: string | null;
}