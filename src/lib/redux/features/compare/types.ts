// features/compare/types.ts
export interface VariantItem {
  product_variant_id: number;
  name: string;
  price: number;
  id: number;
}

export interface ActiveVariant {
  id: number;
  name: string;
  product_id: number;
  active_variant_items: VariantItem[];
}

export interface CompareProduct {
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
  totalSold: number | string; // Updated to accept both number and string
  specifications: [];
  active_variants: ActiveVariant[];
}

export interface CompareResponse {
  products: CompareProduct[];
}

export interface CompareState {
  data: CompareResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
