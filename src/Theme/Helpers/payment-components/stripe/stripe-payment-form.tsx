import React, { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import axios from "axios";
import { getAuthToken } from "@/services/Auth-Token";
import {
  Stripe,
  StripeCardElement,
  PaymentIntent,
  
} from "@stripe/stripe-js";
import { OrderDetails as CheckoutOrderDetails } from "@/Theme/types/checkout";




interface PaymentSuccessResponse {
  paymentIntent: PaymentIntent;
  orderDetails: unknown; // Replace with your actual order details type if known
}

interface CheckoutFormProps {
  amount: string;
  onSuccess: (response: PaymentSuccessResponse) => void;
  onError: (message: string) => void;
  orderDetails: CheckoutOrderDetails;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  onSuccess,
  onError,
  orderDetails,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const token = getAuthToken();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      toast.error("Payment system not initialized");
      return;
    }

    setLoading(true);
    try {
      const amount = orderDetails?.amount;
      if (!amount) {
        throw new Error("Invalid order amount");
      }

      const response = await axios.post<{ clientSecret: string }>(
        "/api/stripe-create-payment-intent",
        {
          data: {
            amount: Number(amount),
            orderId: orderDetails?.order?.order_id,
            currency: orderDetails?.payment_creds?.currency_code,
          },
          metaData: { orderid: orderDetails?.order?.order_id },
        }
      );

      const clientSecret = response.data.clientSecret;
      if (!clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement) as StripeCardElement,
          billing_details: {
            // Add billing details if available
          },
        },
      });

      const payload = {
        order_id: orderDetails?.order?.order_id,
        payment_id: null as string | null,
        transection_id: null as string | null,
        transaction_order_id: null as string | null,
        payment_status: 0,
      };

      if (result.error) {
        payload.payment_status = 0;
        payload.payment_id = result.error.payment_intent?.id || null;
        payload.transection_id =
          result.error.payment_intent?.client_secret || null;
        payload.transaction_order_id = result.error.payment_method?.id || null;

        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/checkout/stripe-response?token=${token}`,
          payload
        );

        onError(result.error.message || "Payment failed");
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        payload.payment_status = 1;
        payload.payment_id = result.paymentIntent.id;
        payload.transection_id = result.paymentIntent.client_secret || null;
        payload.transaction_order_id =
          result.paymentIntent.payment_method?.toString() || null;

        const response = await axios.post<unknown>(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/checkout/stripe-response?token=${token}`,
          payload
        );

        onSuccess({
          paymentIntent: result.paymentIntent,
          orderDetails: response.data,
        });
      }
    } catch (error: unknown) {
      console.log("Payment error:", error);
      let errorMessage = "Payment failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      }
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading
          ? "Processing..."
          : `Pay ${amount} ${orderDetails?.payment_creds?.currency_code}`}
      </button>
    </form>
  );
};

interface StripePaymentFormProps {
  amount: string;
  stripePromise: Promise<Stripe | null>;
  orderDetails: CheckoutOrderDetails;
  orderId?: string;
  onSuccess: (response: PaymentSuccessResponse) => void;
  onClose: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  stripePromise,
  orderDetails,
  onSuccess,
  onClose,
}) => {
  const handlePaymentSuccess = (response: PaymentSuccessResponse) => {
    onSuccess(response);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm
            orderDetails={orderDetails}
            amount={amount}
            onSuccess={handlePaymentSuccess}
            onError={(error) => {
              toast.error(error);
              onClose();
            }}
          />
        </Elements>
      </div>
    </div>
  );
};

export { StripePaymentForm, CheckoutForm };
