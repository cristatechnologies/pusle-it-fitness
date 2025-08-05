import OrderPage from "@/Theme/page-components/profile/orders/page";
import { CatalogModeGuard } from "../../../../middleware/CatalogModeGuard";
import { getPageMetadata } from "@/lib/utils/getPageMetadata";

export async function generateMetadata() {
  const meta = await getPageMetadata("orders");

  return {
    title: meta?.title || "Default Title",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
  };
}


const orders = () => {
  return (
    <>
    <CatalogModeGuard>

    <OrderPage />
    </CatalogModeGuard>
    
    </>
  );
}
export default orders;