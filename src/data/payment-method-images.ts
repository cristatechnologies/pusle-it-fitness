// src/utils/paymentMethods.ts
export const PAYMENT_METHOD_IMAGES = {
  stripe: "/payment-partners/stripe.png",
  square: "/payment-partners/SquareLogoBlack.png",
  razorpay: "/payment-partners/razorpay.png",
  phonepe: "/payment-partners/phone-pe-logo.png",
  cash_on_delivery: "/payment-partners/cash-on-delivery.png",

  // paypal: "/payment-partners/paypal.png",
  // "credit card": "/payment-partners/credit-card.png",
  // Add other payment methods as needed
  default: "/payment-partners/cash-on-delivery.png",
};

export const getPaymentMethodImage = (method: string) => {
  if (!method) return PAYMENT_METHOD_IMAGES.default;
  return PAYMENT_METHOD_IMAGES[method.toLowerCase() as keyof typeof PAYMENT_METHOD_IMAGES] || 
         PAYMENT_METHOD_IMAGES.default;
};