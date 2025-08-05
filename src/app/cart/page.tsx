import MainCart from "@/Theme/page-components/cart/page";
import { getPageMetadata } from "@/lib/utils/getPageMetadata";

export async function generateMetadata() {
  const meta = await getPageMetadata("cart");

  return {
    title: meta?.title || "Default Title",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
  };
}
const Cart = () => {
  return (
    <>
      <MainCart />
    </>
  );
};

export default Cart;
