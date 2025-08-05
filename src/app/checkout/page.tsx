import CheckoutPage from "@/Theme/page-components/checkout/page";

import { CatalogModeGuard } from "../../../middleware/CatalogModeGuard";
import { getPageMetadata } from "@/lib/utils/getPageMetadata";



export async function generateMetadata() {
  const meta = await getPageMetadata("checkout");

  return {
    title: meta?.title || "Default Title",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
  };
}
const checkout = () => {
  return (
    <>
      <CatalogModeGuard>
        <CheckoutPage />
      </CatalogModeGuard>
    </>
  );
};

export default checkout;
