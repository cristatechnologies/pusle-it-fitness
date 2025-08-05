// // services/wishlist.ts

// import { getAuthToken } from "./Auth-Token";

// interface WishlistResponse {
//   notification: string;
//   // Add other response properties if needed
// }

// // export const addToWishlist = async (
// //   productId: number
// // ): Promise<WishlistResponse> => {
// //   const token = getAuthToken();

// //   const response = await fetch(
// //     `${process.env.NEXT_PUBLIC_BASE_URL}api/user/add-to-wishlist/${productId}`,
// //     {
// //       method: "GET",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`,
// //       },
// //     }
// //   );

// //   if (!response.ok) {
// //     throw new Error("Failed to add to wishlist");
// //   }

// //   return response.json();
// // };

// // export const removeFromWishlist = async (
// //   wishlistId: number
// // ): Promise<WishlistResponse> => {
// //   const token = getAuthToken();

// //   const response = await fetch(
// //     `${process.env.NEXT_PUBLIC_BASE_URL}api/user/remove-wishlist/${wishlistId}`,
// //     {
// //       method: "GET", // Changed from GET to DELETE for semantic correctness
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`,
// //       },
// //     }
// //   );

// //   if (!response.ok) {
// //     throw new Error("Failed to remove from wishlist");
// //   }

// //   return response.json();
// // };
