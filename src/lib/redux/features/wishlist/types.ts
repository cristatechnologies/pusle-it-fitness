// features/wishlist/types.ts
export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    name: string;
    short_name: string;
    slug: string;
    thumb_image: string;
    qty: number;
    sold_qty: number;
    price: number;
    offer_price: number | null;
    averageRating: string;
    totalSold: string;
  };
}

export interface WishlistResponse {
    wishlists: {

  current_page: number;
  data: WishlistItem[];
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
};
}

export interface WishlistState {
  data: WishlistResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
