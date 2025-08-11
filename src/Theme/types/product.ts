export type Product = {
  id: number;
  name: string;
  slug: string;
  thumb_image: string;
  qty: number;
  sold_qty: number;
  price: number;
  offer_price: number | null;
  short_description: string;
  long_description: string;
  video_link:string | null;
  sku: string;
  seo_title: string;
  seo_description: string;
  status: number;
  product_type: string;
  is_top: number;
  hsn_code: string;
  new_product: number;
  is_featured: number;
  is_best: number;
  is_flash_deal?: number;
  is_specification: number;
  avg_rating: number;
  min_price: number;
  max_price: number;
  total_reviews: number;
  reward_points: number;
  height: string;
  width: string;
  weight: string;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string;
    image: string;
  };
  brand_id:number;
  gallery_images: Array<{
    id: number;
    image: string;
  }>;
  specifications: Array<{
    id: number;
    name: string;
    value: string;
  }>;
  reviews: Array<{
    id: number;
    user_id: number;
    rating: number;
    review: string;
    status: number;
    created_at: string;
    user: {
      id: number;
      name: string;
      image: string;
    };
  }>;
  active_variants: Array<{
    id: number;
    name: string;
    product_id: number;
    active_variant_items: Array<{
      id: number;
      product_variant_id: number;
      name: string;
      price: number;
    }>;
  }>;
  // Computed fields (not from API directly)
  discount?: string;
  rating?: number;
  image: string; // Alias for thumb_image
  description: string; // Alias for short_description
};

export interface Brand {
  id: number;
  name: string;
  slug: string;
  image: string;
};
export interface ProductResponse {
  product: Product;
  gellery?: Array<{ id: number; image: string }>;
  relatedProducts: Product[];
  recaptchaSetting?: {
    id: number;
    site_key: string;
    secret_key: string;
    status: number;
    created_at: string | null;
    updated_at: string;
  };
  specifications?: Array<{
    id: number;
    product_id: number;
    product_specification_key_id: number;
    specification: string;
    created_at: string;
    updated_at: string;
    key: {
      id: number;
      key: string;
      status: number;
      created_at: string;
      updated_at: string;
      categories_id: number;
    };
  }>;
  totalProductReviewQty: number;
  totalReview: number;
  tags: string | null;
  productReviews: Array<{
    id: number;
    user_id: number;
    rating: number;
    review: string;
    status: number;
    created_at: string;
    updated_at: string;
    user?: {
      id: number;
      name: string;
      image: string;
    };
  }>;
  defaultProfile?: {
    image: string;
  };
}
// export const products: Product[] = [
//   {
//     id: 1,
//     name: "Kara Sofa",
//     slug: "kara-sofa",
//     thumb_image: "/Theme-1/Product-One.jpg",
//     qty: 10,
//     sold_qty: 5,
//     price: 4500,
//     offer_price: 4050,
//     short_description: "Kara Sofa is an art deco-style sofa.",
//     long_description:
//       "Kara Sofa is an art deco-style sofa. Its art deco inspirations are reflected in its shapes, revealing an eclectic, luxurious style.",
//     sku: "KARA-001",
//     seo_title: "Kara Sofa - Art Deco Style",
//     seo_description: "Luxury art deco-style sofa for modern living rooms",
//     status: 1,
//     product_type: "physical",
//     is_top: 1,
//     new_product: 1,
//     is_featured: 1,
//     is_best: 0,
//     is_specification: 1,
//     avg_rating: 4.5,
//     min_price: 1800,
//     max_price: 4500,
//     total_reviews: 12,
//     reward_points: 100,
//     shipping_fee: 50,
//     shipping_type: "standard",
//     shipping_date: "2023-12-15",
//     created_at: "2023-01-10",
//     updated_at: "2023-11-20",
//     category: {
//       id: 1,
//       name: "sofa",
//       slug: "sofa",
//       icon: "/icons/sofa.svg",
//       image: "/categories/sofa.jpg",
//     },
//     brand: {
//       id: 1,
//       name: "HOMMES STUDIO",
//       slug: "hommes-studio",
//       image: "/brands/hommes.jpg",
//     },
//     gallery_images: [
//       { id: 1, image: "/gallery/kara-sofa-1.jpg" },
//       { id: 2, image: "/gallery/kara-sofa-2.jpg" },
//     ],
//     specifications: [
//       { id: 1, name: "Material", value: "Velvet" },
//       { id: 2, name: "Dimensions", value: '90"W x 38"D x 34"H' },
//     ],
//     reviews: [
//       {
//         id: 1,
//         user_id: 101,
//         rating: 5,
//         review: "Excellent quality and comfort",
//         status: 1,
//         created_at: "2023-05-15",
//         user: {
//           id: 101,
//           name: "John Doe",
//           image: "/users/john.jpg",
//         },
//       },
//     ],
//     variants: [
//       {
//         id: 1,
//         name: "Color",
//         variant_items: [
//           { id: 1, name: "Black", price: 4500 },
//           { id: 2, name: "Blue", price: 4600 },
//         ],
//       },
//     ],
//     // Computed fields
//     discount: "-10%",
//     image: "/Theme-1/Product-One.jpg",
//     description: "Kara Sofa is an art deco-style sofa.",
//   },
//   {
//     id: 2,
//     name: "Ajui Sofa",
//     slug: "ajui-sofa",
//     thumb_image: "/Theme-1/Product-One.jpg",
//     qty: 8,
//     sold_qty: 3,
//     price: 5000,
//     offer_price: 4500,
//     short_description: "Ajui Sofa is inspired by the iconic Memphis style.",
//     long_description:
//       "Ajui Sofa is inspired by the iconic Memphis style. The sofa combines an artsy interpretation of a cactus shape and is upholstered in velvet.",
//     sku: "AJUI-002",
//     seo_title: "Ajui Sofa - Memphis Style",
//     seo_description: "Artsy Memphis-style sofa with cactus-inspired design",
//     status: 1,
//     product_type: "physical",
//     is_top: 1,
//     new_product: 1,
//     is_featured: 1,
//     is_best: 0,
//     is_specification: 1,
//     avg_rating: 4.7,
//     min_price: 4500,
//     max_price: 4500,
//     total_reviews: 8,
//     reward_points: 120,
//     shipping_fee: 75,
//     shipping_type: "express",
//     shipping_date: "2023-12-10",
//     created_at: "2023-02-15",
//     updated_at: "2023-11-18",
//     category: {
//       id: 1,
//       name: "sofa",
//       slug: "sofa",
//       icon: "/icons/sofa.svg",
//       image: "/categories/sofa.jpg",
//     },
//     brand: {
//       id: 1,
//       name: "HOMMES STUDIO",
//       slug: "hommes-studio",
//       image: "/brands/hommes.jpg",
//     },
//     gallery_images: [
//       { id: 3, image: "/gallery/ajui-sofa-1.jpg" },
//       { id: 4, image: "/gallery/ajui-sofa-2.jpg" },
//     ],
//     specifications: [
//       { id: 3, name: "Material", value: "Velvet" },
//       { id: 4, name: "Dimensions", value: '85"W x 35"D x 32"H' },
//     ],
//     reviews: [
//       {
//         id: 2,
//         user_id: 102,
//         rating: 4,
//         review: "Beautiful design but a bit firm",
//         status: 1,
//         created_at: "2023-06-20",
//         user: {
//           id: 102,
//           name: "Jane Smith",
//           image: "/users/jane.jpg",
//         },
//       },
//     ],
//     variants: [],
//     // Computed fields
//     discount: "-10%",
//     image: "/Theme-1/Product-One.jpg",
//     description: "Ajui Sofa is inspired by the iconic Memphis style.",
//   },
//   // Additional products would follow the same structure...
//   {
//     id: 4,
//     name: "Moa Sofa",
//     slug: "moa-sofa",
//     thumb_image: "/Theme-1/Product-One.jpg",
//     qty: 5,
//     sold_qty: 7,
//     price: 3000,
//     offer_price: 2800,
//     short_description:
//       "Moa Sofa is a luxury sofa for modern living room design projects.",
//     long_description:
//       "Moa Sofa is a luxury sofa for modern living room design projects. This stunning modern sofa represents the latest designs of sofas.",
//     sku: "MOA-004",
//     seo_title: "Moa Sofa - Luxury Modern Sofa",
//     seo_description: "Stunning modern sofa for contemporary living spaces",
//     status: 1,
//     product_type: "physical",
//     is_top: 0,
//     new_product: 0,
//     is_featured: 1,
//     is_best: 1,
//     is_specification: 1,
//     avg_rating: 4.5,
//     min_price: 2800,
//     max_price: 2800,
//     total_reviews: 15,
//     reward_points: 90,
//     shipping_fee: 60,
//     shipping_type: "standard",
//     shipping_date: "2023-12-05",
//     created_at: "2023-03-10",
//     updated_at: "2023-11-15",
//     category: {
//       id: 2,
//       name: "chairs",
//       slug: "chairs",
//       icon: "/icons/chair.svg",
//       image: "/categories/chairs.jpg",
//     },
//     brand: {
//       id: 3,
//       name: "MOA",
//       slug: "moa",
//       image: "/brands/moa.jpg",
//     },
//     gallery_images: [
//       { id: 7, image: "/gallery/moa-sofa-1.jpg" },
//       { id: 8, image: "/gallery/moa-sofa-2.jpg" },
//     ],
//     specifications: [
//       { id: 7, name: "Material", value: "Leather" },
//       { id: 8, name: "Dimensions", value: '80"W x 36"D x 30"H' },
//     ],
//     reviews: [
//       {
//         id: 4,
//         user_id: 104,
//         rating: 5,
//         review: "Extremely comfortable and stylish",
//         status: 1,
//         created_at: "2023-07-25",
//         user: {
//           id: 104,
//           name: "Robert Johnson",
//           image: "/users/robert.jpg",
//         },
//       },
//     ],
//     variants: [],
//     // Computed fields
//     discount: "-7%",
//     rating: 4.5,
//     image: "/Theme-1/Product-One.jpg",
//     description:
//       "Moa Sofa is a luxury sofa for modern living room design projects.",
//   },
// ];
