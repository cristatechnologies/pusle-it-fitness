// Theme/page-component/profile/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchUserOrders } from "@/services/profileApi";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import ProfileNavbar from "../navbar";
import { withAuth } from "../../../../../middleware/isAuth";
import toast from "react-hot-toast";
import Link from "next/link";

import { settings } from "@/lib/redux/features/website/settings";
import { OrdersResponse,Order } from "@/Theme/types/profile";


const OrderPage = () => {
  const [ordersData, setOrdersData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { currency_icon } = settings();


  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUserOrders(currentPage);
        setOrdersData(data);
      } catch (error) {
        toast.error("Failed to load orders data");
        console.log("Orders error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
        return "Completed";
      case 5:
        return "Declined";
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

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile/dashboard" },
    { label: "Orders", href: "/profile/orders" },
  ];

  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="font-manrope container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">MY ORDERS</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Order Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ordersData?.orders.data.map((order: Order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.order_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.order_status === 0
                                ? "bg-yellow-100 text-yellow-800"
                                : order.order_status === 4
                                ? "bg-green-100 text-green-800"
                                : order.order_status === 5
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {getStatusText(order.order_status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {currency_icon} {order.total_amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link
                            href={`/profile/orders/${order.order_id}`}
                            className="border hover:bg-black py-2 px-6 border-black text-black hover:text-white inline-flex items-center gap-1"
                          >
                         
                            <span>VIEW</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {ordersData?.orders?.last_page &&
              ordersData.orders.last_page > 1 ? (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage === (ordersData?.orders?.last_page ?? 1)
                      }
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {ordersData?.orders?.from ?? 0}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {ordersData?.orders?.to ?? 0}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {ordersData?.orders?.total ?? 0}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Previous</span>
                          &larr;
                        </button>
                        {Array.from(
                          {
                            length: Math.min(
                              5,
                              ordersData?.orders?.last_page ?? 1
                            ),
                          },
                          (_, i) => {
                            const lastPage = ordersData?.orders?.last_page ?? 1;
                            let pageNum;
                            if (lastPage <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= lastPage - 2) {
                              pageNum = lastPage - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === pageNum
                                    ? "z-10 bg-[#c69657] border-[#c69657] text-white"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={
                            currentPage === (ordersData?.orders?.last_page ?? 1)
                          }
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Next</span>
                          &rarr;
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              ) : null}
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

export default withAuth(OrderPage, {
  redirectTo: "/sign-in",
  requireAuth: true,
  authMessage: "Please sign in to view your orders",
});
