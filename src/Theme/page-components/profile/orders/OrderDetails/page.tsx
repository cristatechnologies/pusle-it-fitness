// app/profile/orders/[orderId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchOrderDetails } from "@/services/profileApi";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import ProfileNavbar from "../../navbar";
import { withAuth } from "../../../../../../middleware/isAuth";
import toast from "react-hot-toast";
import Link from "next/link";
import { Download, AlertCircle, ArrowLeft } from "lucide-react";
import { OrderDetailsResponse } from "@/Theme/types/profile";
import { getPaymentMethodImage } from "@/data/payment-method-images";
import Image from "next/image";
import { settings } from "@/lib/redux/features/website/settings";
import { downloadOrderInvoice } from "@/services/orderInvoiceService";



const OrderDetailsPage = () => {
  const params = useParams();
  const orderId = params.orderId as string;
  const [orderData, setOrderData] = useState<
    OrderDetailsResponse["order"] | null
  >(null);
  const [loading, setLoading] = useState(true);
const {currency_icon} = settings();



  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOrderDetails(orderId);
        setOrderData(data.order);
      } catch (error) {
        toast.error("Failed to load order details");
        console.log("Order details error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [orderId]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Processing";
      case 2:
        return "Shipped";
      case 3:
        return "Delivered";
      case 4:
        return "Declined";
      default:
        return "Unknown";
    }
  };

  const getPaymentStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Completed";
      case 2:
        return "Failed";
      // case 3:
      //   return "Refunded";
      default:
        return "Unknown";
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile/dashboard" },
    { label: "Orders", href: "/profile/orders" },
   
  ];

  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="bg-white border-b-2 text-center p-4 text-2xl font-bold mb-8 font-manrope">
        {`ORDER #${orderData.order_id}`}
      </div>
      <div className="bg-white border-b text-center p-4 mb-6">
        <div className="container mx-auto">
          <p className="text-sm text-gray-600 mb-1">
            Order #{orderData.order_id} was placed on{" "}
            {formatDate(orderData.created_at)} and is currently{" "}
            {getStatusText(orderData.order_status)}.
          </p>
        </div>
      </div>
      <div className="font-manrope container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">ORDER DETAILS</h1>
          <Link
            href="/profile/orders"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Order Summary */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium">#{orderData.order_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Placed</p>
                  <p className="font-medium">
                    {formatDate(orderData.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Status</p>
                  <p
                    className={`font-medium ${
                      orderData.order_status === 0
                        ? "text-yellow-600"
                        : orderData.order_status === 4
                        ? "text-red-600"
                        : orderData.order_status === 5
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {getStatusText(orderData.order_status)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p
                    className={`font-medium ${
                      orderData.payment_status === 0
                        ? "text-yellow-600"
                        : orderData.payment_status === 1
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {getPaymentStatusText(orderData.payment_status)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <h3 className="text-md font-semibold mb-3">Items</h3>
              <div className="border  divide-y">
                {orderData.order_products.map((product) => (
                  <div key={product.id} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{product.product_name}</p>
                        {product.order_product_variants.length > 0 && (
                          <div className="mt-1">
                            {product.order_product_variants.map((variant) => (
                              <p
                                key={variant.id}
                                className="text-sm text-gray-500"
                              >
                                {variant.variant_name}: {variant.variant_value}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p>
                          {currency_icon}
                          {product.unit_price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {product.qty}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Subtotal</p>
                  <p>
                    {currency_icon}
                    {(orderData.total_amount - orderData.shipping_cost).toFixed(
                      2
                    )}
                  </p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Shipping</p>
                  <p>
                    {orderData.shipping_cost > 0
                      ? `${currency_icon}${orderData.shipping_cost.toFixed(2)}`
                      : "Free"}
                  </p>
                </div>
                {orderData.coupon_coast > 0 && (
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-600">Discount</p>
                    <p className="text-green-600">
                      -{currency_icon}
                      {orderData.coupon_coast.toFixed(2)}
                    </p>
                  </div>
                )}
                <div className="flex justify-between mt-4 pt-4 border-t font-semibold">
                  <p>Total</p>
                  <p>
                    {currency_icon}
                    {orderData.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping and Billing */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-md font-semibold mb-3">
                    Shipping Address
                  </h3>
                  <address className="not-italic">
                    <p className="font-medium">
                      {orderData.order_address.shipping_name}
                    </p>
                    <p>{orderData.order_address.shipping_address}</p>
                    <p>
                      {orderData.order_address.shipping_city},{" "}
                      {orderData.order_address.shipping_state}{" "}
                      {orderData.order_address.shipping_zip_code}
                    </p>
                    <p>{orderData.order_address.shipping_country}</p>
                    <p className="mt-2">
                      <span className="font-medium">Phone:</span>{" "}
                      {orderData.order_address.shipping_phone}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {orderData.order_address.shipping_email}
                    </p>
                  </address>
                </div>
                <div>
                  <h3 className="text-md font-semibold mb-3">
                    Billing Address
                  </h3>
                  <address className="not-italic">
                    <p className="font-medium">
                      {orderData.order_address.billing_name}
                    </p>
                    <p>{orderData.order_address.billing_address}</p>
                    <p>
                      {orderData.order_address.billing_city},{" "}
                      {orderData.order_address.billing_state}{" "}
                      {orderData.order_address.billing_zip_code}
                    </p>
                    <p>{orderData.order_address.billing_country}</p>
                    <p className="mt-2">
                      <span className="font-medium">Phone:</span>{" "}
                      {orderData.order_address.billing_phone}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {orderData.order_address.billing_email}
                    </p>
                  </address>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-md font-semibold mb-3">Payment Method</h3>
              <div className="flex items-center gap-3">
                <div className="relative w-24 h-24">
                  <Image
                    src={getPaymentMethodImage(orderData.payment_method)}
                    alt={orderData.payment_method}
                    className="object-contain"
                    fill
                  />
                </div>

                {/* <p className="capitalize">{orderData.payment_method}</p> */}
              </div>
              {orderData.transection_id &&
                orderData.transection_id !== "null" && (
                  <p className="mt-1 text-sm text-gray-500">
                    Transaction ID: {orderData.transection_id}
                  </p>
                )}
            </div>

            {/* Order Actions */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => downloadOrderInvoice(orderData.id)}
                  className="flex items-center px-4 py-2 border cursor-pointer  border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </button>
                <button
                  onClick={() => {
                    toast.custom(
                      <div className="bg-white shadow-md rounded p-4 border border-gray-200 max-w-sm">
                        <p className="text-sm text-gray-800 mb-2">
                          Are you sure you want to dispute this order?
                        </p>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => toast.dismiss()}
                            className="px-3 py-1 text-sm text-gray-500 font-medium"
                          >
                            Cancel
                          </button>
                          <button className="px-3 py-1 text-sm text-white bg-red-600 rounded font-medium">
                            Confirm Dispute
                          </button>
                        </div>
                      </div>
                    );
                  }}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Dispute Order
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <ProfileNavbar />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(OrderDetailsPage, {
  redirectTo: "/sign-in",
  requireAuth: true,
  authMessage: "Please sign in to view order details",
});
