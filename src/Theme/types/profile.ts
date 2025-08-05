// types/profile.ts
export interface DashboardData {
  personInfo: {
    id: number;
    name: string;
    phone: string;
    email: string;
    image: string | null;
    country_id: number;
    state_id: number;
    city_id: number | null;
    zip_code: string | null;
    address: string | null;
  };
  totalOrder: number;
  completeOrder: number;
  pendingOrder: number;
  declinedOrder: number;
}


export interface DefaultProfile {
  id: number;
  image: string;
}


export interface PersonInfo {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  zip_code: string | null;
  address: string | null;
}




export interface ProfileResponse {
  personInfo: PersonInfo;
  countries: Country[];
  states: State[];
  cities: City[];
  defaultProfile: DefaultProfile;
}







export interface Order {
  id: number;
  order_id: string;
  user_id: number;
  total_amount: number;
  product_qty: number;
  payment_method: string;
  payment_status: number;
  payment_approval_date: string | null;
  transection_id: string | null;
  shipping_method: string;
  shipping_cost: number;
  coupon_coast: number;
  order_status: number;
  order_approval_date: string | null;
  order_delivered_date: string | null;
  order_completed_date: string | null;
  order_declined_date: string | null;
  delivery_man_id: number;
  order_request: number;
  order_req_date: string | null;
  order_req_accept_date: string | null;
  cash_on_delivery: number;
  additional_info: string | null;
  created_at: string;
  updated_at: string;
  comment: string | null;
  waybill_no: string;
  refund_transaction_id: string | null;
  refund_status: string | null;
  payment_id: string;
  transaction_order_id: string;
}

export interface OrdersResponse {
  orders: {
    current_page: number;
    data: Order[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface OrderProductVariant {
  id: number;
  order_product_id: number;
  product_id: number;
  variant_name: string;
  variant_value: string;
  created_at: string;
  updated_at: string;
}

export interface OrderProduct {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  unit_price: number;
  qty: number;
  refund_transaction_id: string;
  refund_status: number;
  created_at: string;
  updated_at: string;
  order_product_variants: OrderProductVariant[];
}

export interface OrderAddress {
  id: number;
  order_id: number;
  billing_name: string;
  billing_email: string;
  billing_phone: string;
  billing_address: string;
  billing_country: string;
  billing_state: string;
  billing_city: string;
  billing_address_type: string;
  billing_zip_code: string;
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_country: string;
  shipping_state: string;
  shipping_city: string;
  shipping_address_type: string;
  shipping_zip_code: string;
  created_at: string;
  updated_at: string;
}

export interface OrderDetailsResponse {
  order: Order & {
    order_products: OrderProduct[];
    order_address: OrderAddress;
  };
}



export interface Country {
  id: number;
  name: string;
  slug: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface State {
  id: number;
  name: string;
  country_id?: number;
}

export interface City {
  id: number;
  name: string;
  state_id?: number;
}



export interface Address {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  country_id: number;
  state_id: number;
  city_id: string;
  address: string;
  type: string;
  default_shipping: number;
  default_billing: number;
  zip_code: string;
  created_at: string;
  updated_at: string;
  country: {
    id: number;
    name: string;
  };
  country_state: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
}



// types/profile.ts
export interface Product {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  thumb_image: string;
  qty: number;
  sold_qty: number;
  price: number;
  offer_price: number | null;
  averageRating: string;
  totalSold: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  review: string;
  rating: number;
  status: number;
  created_at: string | null;
  updated_at: string | null;
  product: Product;
}

export interface ReviewsResponse {
  reviews: {
    current_page: number;
    data: Review[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}