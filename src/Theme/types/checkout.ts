// Removed duplicate CheckoutResponse interface to resolve type conflict

// checkout.ts
export interface Address {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: {
    name: string;
  };
  country_state: {
    name: string;
  };
  city: {
    name: string;
  };
  zip_code: string;
  default_shipping: number;
  default_billing: number;
}

export interface CartProduct {
  id: number;
  product_id: number;
  qty: number;
 
  product: {
    id: number;
    name: string;
    price: number;
    short_name?:string;
    offer_price?: number;
  };
  variants: {
    id: number;
    variant_item: {
      name: string;
      price: number;
    };
  }[];
}

export interface PaymentMethodInfo {
  status: number;
}

export interface CheckoutResponse {
  cartProducts: CartProduct[];
  addresses: Address[];
  stripePaymentInfo: PaymentMethodInfo;
  razorpayPaymentInfo: PaymentMethodInfo;
  squareup: PaymentMethodInfo;
  flutterwavePaymentInfo: PaymentMethodInfo;
  phonepe: PaymentMethodInfo;
  paypalPaymentInfo: PaymentMethodInfo;
  bankPaymentInfo: PaymentMethodInfo;
  instamojo: PaymentMethodInfo;
  sslcommerz: PaymentMethodInfo;
  myfatoorah: PaymentMethodInfo;
}

// types/checkout.ts
export interface PincodeCheckResponse {
  shippingCost: number;
  shippingRule: string;
  serviceable: boolean;
  cod: boolean;
  prepaid: boolean;
}

// Add to your types/checkout.ts file
export interface StripePaymentCredentials {
  id: string;
  status: string;
  stripe_key: string;
  stripe_secret: string;
  created_at: string;
  updated_at: string;
  country_code: string;
  currency_code: string;
  currency_rate: string;
}

export interface OrderStoreCommonResponse {
  order: {
    order_id: string;
    user_id: number;
    total_amount: string;
    product_qty: number;
    payment_method: string;
    transection_id: string | null;
    payment_status: number;
    shipping_method: string;
    shipping_cost: string;
    coupon_coast: number;
    order_status: number;
    cash_on_delivery: number;
    updated_at: string;
    created_at: string;
    id: number;
  };
  payment_creds: StripePaymentCredentials;
  amount: string;
}

export interface DecryptedStripeKeys {
  id: string;
  status: string;
  stripe_key: string;
  stripe_secret: string;
  created_at: string;
  updated_at: string;
  country_code: string;
  currency_code: string;
  currency_rate: string;
}

export interface ApiError {
  error: {
    response?: {
      data?: {
        message?: string;
      };
    };
  };
  // message?: string;
}

export interface PaymentCreds {
  id: string;
  status: string;
  stripe_key?: string;
  stripe_secret?: string;
  merchant_id?: string;
  api_key?: string;
  salt_index?: string;
  account_mode?: string;
  created_at: string;
  updated_at: string;
  country_code: string;
  currency_code: string;
  currency_rate: string;
}

export interface OrderDetails {
  order: {
    order_id: string;
    user_id: number;
    total_amount: string;
    product_qty: number;
    payment_method: string;
    transection_id: string | null;
    payment_status: number;
    shipping_method: string;
    shipping_cost: number;
    coupon_coast: number;
    order_status: number;
    cash_on_delivery: number;
    updated_at: string;
    created_at: string;
    id: number;
  };
  payment_creds: PaymentCreds;
  amount: string;
}
