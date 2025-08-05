import { CheckoutResponse } from "@/Theme/types/checkout";
import { getAuthToken } from "./Auth-Token";
import axios from "axios";
import { PincodeCheckResponse } from "@/Theme/types/checkout";
import CryptoUtils from "@/lib/utils/crypto-utils";
import { PaymentCreds,OrderDetails } from "@/Theme/types/checkout";
import { loadStripe, Stripe as StripeJs } from '@stripe/stripe-js';
// Remove the import of Stripe from 'stripe'

const token = getAuthToken();
export const fetchCheckoutData = async (): Promise<CheckoutResponse> => {
 
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/checkout`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const checkPincodeServiceability = async (
  shippingAddressId: string
): Promise<PincodeCheckResponse> => {

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/checkout/pincode-check`,
    {
      shipping_address_id: shippingAddressId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


export const applyCoupon = async (couponCode: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/user/apply-coupon`,
      {
        params: { coupon: couponCode },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to apply coupon"
      );
    }
    throw new Error("Failed to apply coupon");
  }
};



interface phonepeResponse {
  success:boolean;
  redirectUrl:string;

}

// services/checkout.ts
export const handleCashOnDelivery = async (
  shippingAddressId: string,
  billingAddressId: string,
  shippingCost: number,
  shippingRule: string,
  coupon?: string
): Promise<{ message: string; order_id?: string ; success:boolean}> => {
  const authToken = getAuthToken();
  if (!authToken) throw new Error("Authentication required");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/user/checkout/cash-on-delivery`,
      {
        shipping_address_id: shippingAddressId,
        billing_address_id: billingAddressId,
        shipping_cost: shippingCost,
        shipping_rule: shippingRule,
        coupon: coupon? coupon : null,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return { success: true, order_id: response.data.order_id, message:response.data?.message };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "COD payment failed",
      };
    }
    return { success: false, message: "COD payment failed" };
  }
};



export const handleStripePayment = async (
  shippingRule: string,
  shippingCost: string,
  selectedShipping: string,
  couponCode: string | null,
  selectedBilling: string
): Promise<{
  stripePromise: Promise<StripeJs | null> | null;
  orderDetails: OrderDetails;
}> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/user/checkout/order-store-common?token=${token}&shipping_rule=${shippingRule}&shipping_cost=${shippingCost}&shipping_address_id=${selectedShipping}&coupon=${
      couponCode || ""
    }&billing_address_id=${selectedBilling}&payment_method=stripe`;

    const response = await axios.get<OrderDetails>(url);

    if (response.status === 200) {
      const cryptoUtils = new CryptoUtils(
        process.env.NEXT_PUBLIC_APP_KEY as string
      );

      const decryptedKeys: PaymentCreds = {
        id: cryptoUtils.decrypt(response.data.payment_creds.id),
        status: cryptoUtils.decrypt(response.data.payment_creds.status),
        created_at: cryptoUtils.decrypt(response.data.payment_creds.created_at),
        updated_at: cryptoUtils.decrypt(response.data.payment_creds.updated_at),
        country_code: cryptoUtils.decrypt(
          response.data.payment_creds.country_code
        ),
        currency_code: cryptoUtils.decrypt(
          response.data.payment_creds.currency_code
        ),
        currency_rate: cryptoUtils.decrypt(
          response.data.payment_creds.currency_rate
        ),
      };

      if (response.data.payment_creds.stripe_key) {
        decryptedKeys.stripe_key = cryptoUtils.decrypt(
          response.data.payment_creds.stripe_key
        );
      }
      if (response.data.payment_creds.stripe_secret) {
        decryptedKeys.stripe_secret = cryptoUtils.decrypt(
          response.data.payment_creds.stripe_secret
        );
      }

      const stripePromise = decryptedKeys.stripe_key
        ? loadStripe(decryptedKeys.stripe_key)
        : null;

      return {
        stripePromise,
        orderDetails: {
          ...response.data,
          payment_creds: decryptedKeys,
        },
      };
    }

    throw new Error("Failed to create order");
  } catch (error) {
    console.log("Error processing Stripe payment:", error);
    throw error;
  }
};

export const handlePhonePePayment = async (
  shippingRule: string,
  shippingCost: string,
  selectedShipping: string,
  couponCode: string | null,
  selectedBilling: string
): Promise<phonepeResponse> => {
  try {
    const url = `${
      process.env.NEXT_PUBLIC_BASE_URL
    }api/user/checkout/order-store-common?token=${token}&shipping_rule=${shippingRule}&shipping_cost=${shippingCost}&shipping_address_id=${selectedShipping}&coupon=${
      couponCode || ""
    }&billing_address_id=${selectedBilling}&payment_method=phonepe`;

    const response = await axios.get<OrderDetails>(url);

    if (response.status === 200) {
      const baseurl = window.location.origin;
      const phonepePayload = {
        baseurl,
        merchantTransactionId: response.data.order.order_id,
        amount: response.data.amount,
        payment_keys: {
          merchant_id: response.data.payment_creds.merchant_id,
          api_key: response.data.payment_creds.api_key,
          salt_index: response.data.payment_creds.salt_index,
          account_mode: response.data.payment_creds.account_mode,
        },
      };
      const phonepeUrl = await axios.post(
        `/api/payments/phone-pe/initiate-payment`,
        phonepePayload
      );
      console.log(phonepeUrl.data.success);
      if (phonepeUrl.data.success === true) {
        return phonepeUrl.data;
      }
      // Handle PhonePe specific logic here
      // For example, you might want to decrypt payment credentials similar to Stripe
    }

    throw new Error("Failed to create PhonePe order");
  } catch (error) {
    console.log("Error processing PhonePe payment:", error);
    throw error;
  }
};

// Similarly, you can add other payment methods like Razorpay, PayPal, etc.




export const fetchOrderStatus = async (orderId: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/order-show/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.status ) {
    throw new Error("Failed to fetch order status");
  }
  return response.data;
};



// Add this to checkout.ts
// export const placeOrder = async (orderData: {
//   shipping_rule: string;
//   shipping_cost: number;
//   shipping_address_id: string;
//   coupon: string | null;
//   billing_address_id: string;
//   payment_method: string;
// }): Promise<any> => {
//   const token = getAuthToken();
//   const response = await axios.post(
//     `${process.env.NEXT_PUBLIC_BASE_URL}api/user/checkout/order-store-common`,
//     orderData,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return response.data;
// };