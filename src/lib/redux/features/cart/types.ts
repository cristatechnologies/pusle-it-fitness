// features/cart/types.ts


export interface VariantItem {
  id: number;
  product_variant_name: string;
  name: string;
  price: number;
}

export interface ProductVariant {
  id: number;
  shopping_cart_id: number;
  variant_id: number;
  variant_item_id: number;
  variant_item: VariantItem;
}

export interface CartProduct {
  id: number;
  product_id: number;
  qty: number;
  product: {
    id: number;
    name: string;
    short_name: string;
    slug: string;
    thumb_image: string;
    price: number;
    offer_price: number | null;
    weight: string;
    qty: number;
    sold_qty: number;
    // Add other product properties as needed
  };
  variants: ProductVariant[];
}

export interface CartResponse {
  cartProducts: CartProduct[];
}

export interface CartState {
  data: CartResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
