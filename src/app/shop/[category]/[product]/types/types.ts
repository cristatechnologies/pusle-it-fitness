// types.ts
// import { Product } from "@/Theme/types/product";
// import { Review } from "@/Theme/types/profile";
import { ProductResponse } from "@/Theme/types/product";
export interface PageProps {
  params: {
    slug: string;
  };
  searchParams?: Record<string, string | string[]>;
}

// export interface GalleryImage {
//   id: number;
//   product_id: number;
//   image: string;
//   status: number;
//   created_at: string;
//   updated_at: string;
// }

// export interface specifications{
  
//     id: number,
//     product_id: number,
//     product_specification_key_id: number,
//     specification: string,
//     created_at: string,
//     updated_at: string,
//     key: {
//         id: number,
//         key: string,
//         status: number,
//         created_at: string,
//         updated_at: string,
//         categories_id: number | null
//     }


// }

// export interface RecaptchaSetting {
//   id: number;
//   site_key: string;
//   secret_key: string;
//   status: number;
//   created_at: string | null;
//   updated_at: string;
// }

// export interface DefaultProfile {
//   image: string;
// }

// export interface ProductResponse {
//   product: Product & {
//     active_variants?: Array<{
//       id: number;
//       name: string;
//       active_variant_items: Array<{
//         id: number;
//         name: string;
//         price: number;
//       }>;
//     }>;
//     averageRating?: string;
//   };
//   gellery: GalleryImage[];
//   tags: string;
//   totalProductReviewQty: number;
//   totalReview: number;
//   productReviews: Review[];
//   specifications: specifications[];
//   recaptchaSetting: RecaptchaSetting;
//   relatedProducts: Product[];
//   defaultProfile?: DefaultProfile;
// }

export interface ProductPageProps {
  productData: ProductResponse;
}
