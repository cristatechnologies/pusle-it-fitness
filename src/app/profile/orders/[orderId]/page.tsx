import OrderDetailsPage from "@/Theme/page-components/profile/orders/OrderDetails/page";
import { CatalogModeGuard } from "../../../../../middleware/CatalogModeGuard";

const OrderDetails = () => {
  return (
    <>
      <CatalogModeGuard>
        <OrderDetailsPage />
      </CatalogModeGuard>
    </>
  );
};

export default OrderDetails;
