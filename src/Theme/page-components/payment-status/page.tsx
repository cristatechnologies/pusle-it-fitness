// components/payment-status/index.jsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  storePaymentResponse,
  checkPhonePeStatus,
  
  getStatusInfo,
} from "@/services/payment-status";
import Link from "next/link";

export default function PaymentStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [orderId, setOrderId] = useState("");
  const [paymentBy, setPaymentBy] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [nextRetryDelay, setNextRetryDelay] = useState(3000);
  const [hasStoredPendingPayment, setHasStoredPendingPayment] = useState(false);

  useEffect(() => {
    const orderIdParam = searchParams.get("order_id") || "";
    const paymentByParam = searchParams.get("By") || "stripe"; // Default to stripe if no By param

    if (orderIdParam) {
      setOrderId(orderIdParam);
    }
    if (paymentByParam) {
      setPaymentBy(decodeURI(paymentByParam));
    }

    checkPaymentStatus(orderIdParam, paymentByParam);
  }, [searchParams]);

  useEffect(() => {
    if (paymentStatus === "pending" && orderId) {
      const timer = setTimeout(() => {
        checkPaymentStatus(orderId, paymentBy);
        updateRetryStrategy();
      }, nextRetryDelay);

      return () => clearTimeout(timer);
    }
  }, [paymentStatus, orderId, retryCount, nextRetryDelay, paymentBy]);

  const updateRetryStrategy = () => {
    setRetryCount((prev) => prev + 1);

    if (retryCount < 10) {
      setNextRetryDelay(3000);
    } else if (retryCount < 20) {
      setNextRetryDelay(6000);
    } else if (retryCount < 30) {
      setNextRetryDelay(10000);
    } else if (retryCount < 32) {
      setNextRetryDelay(30000);
    } else {
      setNextRetryDelay(60000);
    }
  };

  const checkPaymentStatus = async (orderId: string, gateway: string) => {
    try {
      setIsLoading(true);
      let response;

      if (gateway.toLowerCase() === "phonepe") {
        response = await checkPhonePeStatus(orderId);
      } if (gateway.toLowerCase() === "stripe") {
        console.log("add stripe logic")
        // response = await checkStripeStatus(orderId);
      } else {
      }
      console.log("response from phhonepe api before success check", response);

      if (response.success) {
        console.log("check status in payment status page component",response)
        setPaymentStatus(response.status);

        if (response.status !== "pending") {
          const shouldRedirect = await storePaymentResponse(
            response,
            orderId,
            gateway
          );
          if (!shouldRedirect) {
            setNextRetryDelay(0);
          }
        } else if (retryCount >= 10 && !hasStoredPendingPayment) {
          const shouldRedirect = await storePaymentResponse(
            response,
            orderId,
            gateway
          );
          if (!shouldRedirect) {
            setHasStoredPendingPayment(true);
          }
        }
      } else {
        setPaymentStatus("failure");
        await storePaymentResponse(
          {
            status: "failure",
            raw: {
              orderId: orderId,
              metaInfo: { udf1: orderId },
              paymentDetails: `Error fetching payment status from ${gateway}`,
            },
          },
          orderId,
          gateway
        );
      }
    } catch (error) {
      console.log("Error checking payment status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryPayment = () => {
    router.push("/payment");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleRefreshStatus = () => {
    checkPaymentStatus(orderId, paymentBy);
  };

  if (isLoading) {
    const loadingStatus = getStatusInfo("pending");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          {loadingStatus.icon()}
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Checking Payment Status
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your payment...
          </p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(paymentStatus);

  if (paymentStatus === "pending") {
    statusInfo.message = `Your payment is being processed. We'll automatically check again in ${
      nextRetryDelay / 1000
    } seconds.`;
  }

  return (
    <div
      className={`font-manrope min-h-screen ${statusInfo.bgColor} flex items-center justify-center p-4`}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {statusInfo.icon()}

        <h1 className={`text-2xl font-bold ${statusInfo.textColor} mb-2`}>
          {statusInfo.title}
        </h1>

        <p className="text-gray-600 mb-6">{statusInfo.message}</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium text-gray-800">
                {orderId || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium text-gray-800 capitalize">
                {paymentBy || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`font-medium capitalize ${statusInfo.textColor}`}
              >
                {paymentStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {paymentStatus === "success" && (
         <div className="flex flex-col gap-3">
             <button
              onClick={handleGoHome}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              Continue Shopping
            </button>
            <button
           
            className="w-full bg-white  text-black  font-medium py-3 px-4 rounded-lg transition duration-200"
          >
      <Link href={`/profile/orders/${orderId}`}>
        View Order
      </Link>
          </button>
          </div>
          )}

          {paymentStatus === "failure" && (
            <>
              <button
                onClick={handleRetryPayment}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
              >
                Retry Payment
              </button>
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200"
              >
                Go to Home
              </button>
            </>
          )}

          {paymentStatus === "pending" && (
            <button
              onClick={handleRefreshStatus}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              Refresh Status
            </button>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-500">
          {paymentStatus === "pending" && (
            <p>This page will automatically refresh in a few moments.</p>
          )}
          {paymentStatus === "failure" && (
            <p>
              If you continue to face issues, please contact our support team.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
