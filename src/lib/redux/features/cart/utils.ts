// features/cart/utils.ts
import { CartState } from "./types";

export const isProductInCart = (
  cart: CartState,
  productId: number,
  variantItemIds: number[]
): boolean => {
  if (!cart.data?.cartProducts) return false;

  return cart.data.cartProducts.some((cartProduct) => {
    // Check if it's the same product
    if (cartProduct.product_id !== productId) return false;

    // Check if all selected variants match
    const cartVariantItemIds = cartProduct.variants.map(
      (v) => v.variant_item_id
    );
    return (
      variantItemIds.length === cartVariantItemIds.length &&
      variantItemIds.every((id) => cartVariantItemIds.includes(id))
    );
  });
};
