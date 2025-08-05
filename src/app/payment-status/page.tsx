import PaymentStatus from "@/Theme/page-components/payment-status/page";
import { Suspense } from "react";
const OrderStatus = () => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentStatus />
      </Suspense>
    );
}

export default OrderStatus;