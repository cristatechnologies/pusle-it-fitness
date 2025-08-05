// services/payment-status.ts
"use client"
import { getAuthToken } from "./Auth-Token";
import axios from "axios";


import { SuccessIcon,FailureIcon,PendingIcon } from "@/Theme/Helpers/icons";





interface PaymentResponse {
  status?: string;
  payment_status?: number;
  raw?: {
    metaInfo?: {
      udf1?: string;
    };
    paymentDetails?: string;
    orderId?: string;
  };
  order?: {
    order_id?: string;
  };
  id?: string;
}

export const storePaymentResponse = async (
  response: PaymentResponse,
  orderId: string,
  paymentGateway: string
) => {
  try {
    let paymentStatusValue: number;
    if (response.status === "success" || response.payment_status === 1) {
      paymentStatusValue = 1;
    } else if (response.status === "failure" || response.payment_status === 2) {
      paymentStatusValue = 2;
    } else {
      paymentStatusValue = 0;
    }

    const payload = {
      name: paymentGateway,
      order_id:
        response.raw?.metaInfo?.udf1 || orderId || response.order?.order_id,
      payment_status: paymentStatusValue,
      payment_id: null,
      transaction_id: response.raw?.orderId || response.id || orderId,
      transaction_order_id: 201, // Make dynamic if needed
      notes:
        response.raw?.paymentDetails ||
        `Payment processed via ${paymentGateway}`,
    };



    const apiResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/store-payment-response`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    return (
      apiResponse.status === 200 &&
      apiResponse.data.notification === "Create Successfully"
    );
    
  } catch (error) {
    console.error("Error storing payment response:", error);
    return false;
  }
};

export const checkPhonePeStatus = async (orderId: string) => {
    console.log("checkphone-pe-status")
    const payload = {
        orderId
    }
  const response = await axios.post(
    `/api/payments/phone-pe/order-status`,
    payload
  );
  console.log("my phonepe api log",response.data)
  return response.data;
};



export const getStatusInfo = (paymentStatus: string) => {
    console.log(paymentStatus)
    switch (paymentStatus) {
      case "success":
      case "completed":
        return {
          title: "Payment Successful!",
          message: "Your payment has been processed successfully.",
          bgColor: "bg-green-50",
          textColor: "text-green-800",
          icon: SuccessIcon
        };
      case "failure":
      case "failed":
        return {
          title: "Payment Failed",
          message: "Your payment could not be processed. Please try again.",
          bgColor: "bg-red-50",
          textColor: "text-red-800",
          icon: FailureIcon
        };
      case "pending":
      case "processing":
      default:
        return {
          title: "Payment Processing",
          message: "Your payment is being processed. Please wait...",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-800",
          icon: PendingIcon
        };
    }
  };   
      
  


export const mapStripeStatus = (status: number): string => {
  switch (status) {
    case 1:
      return "completed";
    case 0:
      return "processing";
    default:
      return "pending";
  }
};
