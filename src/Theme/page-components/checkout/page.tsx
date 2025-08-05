"use client";

import { useState, useEffect } from "react";
import { Label } from "@/Theme/shadcn/components/ui/label";
import { Textarea } from "@/Theme/shadcn/components/ui/textarea";
import { Checkbox } from "@/Theme/shadcn/components/ui/checkbox";
import { Button } from "@/Theme/shadcn/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/Theme/shadcn/components/ui/radio-group";
import { Plus, Minus, Trash2 } from "lucide-react";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import { fetchCheckoutData } from "@/services/checkout";

import { CartProduct, CheckoutResponse } from "@/Theme/types/checkout";
import { Address } from "@/Theme/types/checkout";
import { settings } from "@/lib/redux/features/website/settings";
import { PincodeCheckResponse } from "@/Theme/types/checkout";
import { checkPincodeServiceability,applyCoupon } from "@/services/checkout";
import Image from "next/image";
import {
  handleStripePayment,
  handlePhonePePayment,
  handleCashOnDelivery,
} from "@/services/checkout";
import { useRouter } from "next/navigation";
import { withAuth } from "../../../../middleware/isAuth";
import toast from "react-hot-toast";
import { StripePaymentForm } from "@/Theme/Helpers/payment-components/stripe/stripe-payment-form";
import { OrderDetails } from "@/Theme/types/checkout";
import { Stripe as StripeJs } from "@stripe/stripe-js";
import axios from "axios";
import CheckoutSkeleton from "./checkout-skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/Theme/shadcn/components/ui/tooltip";
import { deleteAddress, createAddress } from "@/services/profileApi";
import {
  fetchCitiesByState,
  fetchCountries,
  fetchStatesByCountry,
} from "@/services/fetch-country-fetch-state";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";



const CheckoutPage = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"billing" | "shipping">("billing");
  const [orderError, setOrderError] = useState<string | null>(null);

  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  // const [termsAccepted, setTermsAccepted] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutResponse | null>(
    null
  );
  const [countries, setCountries] = useState<{ id: number; name: string }[]>(
    []
  );
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<
    string | null
  >(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<
    string | null
  >(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [pincodeCheck, setPincodeCheck] = useState<PincodeCheckResponse | null>(
    null
  );
  const [loadingPincode, setLoadingPincode] = useState(false);
  const { currency_icon } = settings();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "us",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "ca",
    zipCode: "",
    phone: "",
    email: "",
    orderNotes: "",
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    name: string;
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const [placingOrder, setPlacingOrder] = useState(false);



  const [showStripeForm, setShowStripeForm] = useState(false);
  const [stripePromise, setStripePromise] =
    useState<Promise<StripeJs | null> | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Checkout", href: "/checkout" },
  ];

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };


  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const response = await applyCoupon(couponCode);
      setAppliedCoupon({
        code: response.coupon.code,
        discount: response.coupon.discount,
        name: response.coupon.name,
      });

      // Show confetti animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      toast.success(`Coupon "${response.coupon.code}" applied successfully!`);

      // Update the checkout data with the new prices
      if (checkoutData) {
        setCheckoutData({
          ...checkoutData,
          cartProducts: checkoutData.cartProducts.map((item) => ({
            ...item,
            product: {
              ...item.product,
              price: response.finalPrice / response.coupon.apply_qty, // Adjust as needed based on your API response
            },
          })),
        });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to apply coupon"
      );
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");

    // Reset prices if needed
    if (checkoutData) {
      // You might need to fetch the original prices again or store them in state
      // This depends on your application logic
    }
  };

  const handleSubmitAddress = async () => {
    try {
      const addressData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.streetAddress,
        type: activeTab === "billing" ? "1" : "2", // 1 for billing, 2 for shipping
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zip_code: formData.zipCode,
      };

      const response = await createAddress(addressData);
      toast.success(response.notification);

      // Refresh addresses list
      const data = await fetchCheckoutData();
      setCheckoutData(data);

      // Close the form
      setShowAddressForm(false);

      // Reset form data if needed
      setFormData({
        firstName: "",
        lastName: "",
        companyName: "",
        country: "",
        streetAddress: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: "",
        orderNotes: "",
      });
    } catch (error) {
      console.error("Address submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save address"
      );
    }
  };

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const data = await fetchCheckoutData();
        setCheckoutData(data);

        // Find default addresses
        const defaultBilling = data.addresses.find(
          (addr) => addr.default_billing === 1
        );
        const defaultShipping = data.addresses.find(
          (addr) => addr.default_shipping === 1
        );

        // Set first address as default if no default exists
        let billingId = defaultBilling ? defaultBilling.id.toString() : null;
        let shippingId = defaultShipping ? defaultShipping.id.toString() : null;

        if (!billingId && data.addresses.length > 0) {
          billingId = data.addresses[0].id.toString();
        }

        if (!shippingId && data.addresses.length > 0) {
          shippingId = data.addresses[0].id.toString();
        }

        setSelectedBillingAddress(billingId);
        setSelectedShippingAddress(shippingId);

        // Trigger pincode check if shipping address exists
        if (shippingId) {
          handleShippingAddressSelect(shippingId);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log(error);

          const message = error.response?.data?.message;

          if (message === "Your shopping cart is empty") {
            setOrderError("Your shopping cart is empty");
            setCheckoutData(null); // just to be sure
          } else {
            setOrderError("Something went wrong. Please try again later.");
          }
        }
      } finally {
       
          setLoading(false);
     
      }
    };

    loadCheckoutData();
  }, []);

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await deleteAddress(Number(addressId));

      // Success case - API returns { notification: "Delete Successfully" }
      toast.success(response.notification);

      // Refresh the checkout data to get updated addresses
      const data = await fetchCheckoutData();
      setCheckoutData(data);

      // Reset selected addresses if they were deleted
      if (selectedBillingAddress === addressId) {
        setSelectedBillingAddress(null);
      }
      if (selectedShippingAddress === addressId) {
        setSelectedShippingAddress(null);
      }
    } catch (error) {
      console.error("Delete address error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete address"
      );
    }
  };

  const handleShippingAddressSelect = async (addressId: string) => {
    setSelectedShippingAddress(addressId);
    setLoadingPincode(true);
    try {
      const response = await checkPincodeServiceability(addressId);
      setPincodeCheck(response);
      // If not serviceable, reset payment method
      if (!response.serviceable) {
        setSelectedPaymentMethod("");
      }
    } catch (error) {
      console.log("Failed to check pincode serviceability:", error);
      setPincodeCheck(null);
    } finally {
      setLoadingPincode(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const countriesData = await fetchCountries();
        setCountries(countriesData);
      } catch (error) {
        toast.error("Failed to load countries");
        console.log("Countries error:", error);
      }
    };

    loadInitialData();
  }, []);

  const handleCountryChange = async (countryId: number) => {
    setFormData((prev) => ({
      ...prev,
      country: countryId.toString(),
      state: "",
      city: "",
    }));

    try {
      const statesData = await fetchStatesByCountry(countryId);
      setStates(statesData);
      setCities([]); // Reset cities when country changes
    } catch (error) {
      toast.error("Failed to load states");
      console.log("States error:", error);
    }
  };

  const handleStateChange = async (stateId: number) => {
    setFormData((prev) => ({
      ...prev,
      state: stateId.toString(),
      city: "",
    }));

    try {
      const citiesData = await fetchCitiesByState(stateId);
      setCities(citiesData);
    } catch (error) {
      toast.error("Failed to load cities");
      console.log("Cities error:", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      setOrderError("Please select a payment method");
      return;
    }

    if (!selectedShippingAddress) {
      setOrderError("Please select a shipping address");
      return;
    }

    setPlacingOrder(true);

    try {
      if (selectedPaymentMethod === "cod") {
        // Handle COD payment
        const result = await handleCashOnDelivery(
          selectedShippingAddress,
          selectedBillingAddress || selectedShippingAddress,
          pincodeCheck?.shippingCost || 0,
          pincodeCheck?.shippingRule || ""
        );

        if (result.success) {
          console.log(result);
          toast.success(result.message);
          router.push(`/profile/orders/${result.order_id}`);
        } else {
          setOrderError(result.message || "Failed to place COD order");
        }
        return;
      }

      switch (selectedPaymentMethod) {
        case "stripe":
          const { stripePromise, orderDetails } = await handleStripePayment(
            pincodeCheck?.shippingRule || "",
            pincodeCheck?.shippingCost !== undefined
              ? String(pincodeCheck.shippingCost)
              : "0",
            selectedShippingAddress,
            couponCode,
            selectedBillingAddress || selectedShippingAddress
          );
          setStripePromise(stripePromise);
          setOrderDetails(orderDetails);
          setShowStripeForm(true);
          break;

        case "phonepe":
          const phonePeOrderDetails = await handlePhonePePayment(
            pincodeCheck?.shippingRule || "",
            pincodeCheck?.shippingCost !== undefined
              ? String(pincodeCheck.shippingCost)
              : "0",
            selectedShippingAddress,
            couponCode,
            selectedBillingAddress || selectedShippingAddress
          );

          console.log(phonePeOrderDetails);
          if (phonePeOrderDetails.success === true)
            router.push(phonePeOrderDetails.redirectUrl);
          break;

        case "razorpay":
          // Handle Razorpay payment
          break;

        case "paypal":
          // Handle PayPal payment
          break;

        // Add cases for other payment methods as needed

        default:
          setOrderError("Selected payment method is not supported");
          break;
      }
    } catch (error) {
      setOrderError("Failed to initialize payment. Please try again.");
      console.log("Payment initialization error:", error);
    } finally {
      setPlacingOrder(false);
    }
  };

  console.log(selectedPaymentMethod);

  if (loading) {
    return <CheckoutSkeleton />;
  }

  if (orderError === "Your shopping cart is empty") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center font-manrope">
        <Image
          src="/default-images/empty-cart.png" // replace with your actual image path
          alt="Empty cart"
          width={200}
          height={200}
          className="mb-6"
        />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="mb-6 text-gray-600">
          You have no items in your shopping cart. Let’s find something you’ll
          love.
        </p>
        <button
          onClick={() => router.push("/shop")}
          className="bg-black cursor-pointer text-white px-4 py-2  hover:bg-gray-800 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (!checkoutData) {
    return <div>Failed to load checkout data</div>;
  }

  // Filter payment methods based on status
  const availablePaymentMethods = [
    {
      id: "cod",
      label: "Cash on Delivery (COD)",
      status: 1, // Since COD availability comes from pincodeCheck
    },
    {
      id: "stripe",
      label: "Stripe",
      status: checkoutData.stripePaymentInfo.status,
    },
    {
      id: "razorpay",
      label: "Razorpay",
      status: checkoutData.razorpayPaymentInfo.status,
    },
    { id: "square", label: "Square", status: checkoutData.squareup.status },
    {
      id: "phonepe",
      label: "PhonePe",
      status: checkoutData.phonepe.status,
    },
    {
      id: "flutterwave",
      label: "Flutterwave",
      status: checkoutData.flutterwavePaymentInfo.status,
    },
    {
      id: "paypalPaymentInfo",
      label: "PayPal",
      status: checkoutData.paypalPaymentInfo.status,
    },
    {
      id: "bankPaymentInfo",
      label: "BankPayment",
      status: checkoutData.bankPaymentInfo.status,
    },
    {
      id: "instamojo",
      label: "Instamojo",
      status: checkoutData.instamojo.status,
    },
    {
      id: "sslcommerz",
      label: "Sslcommerz",
      status: checkoutData.sslcommerz.status,
    },
    {
      id: "myfatoorah",
      label: "Myfatoorah",
      status: checkoutData.myfatoorah.status,
    },
  ].filter((method) => method.status === 1);


  const subtotal = checkoutData.cartProducts.reduce(
    (total: number, item: CartProduct) =>
      total + (item.product.offer_price || item.product.price) * item.qty,
    0
  );

  const total = subtotal + (pincodeCheck?.shippingCost || 0);
  const renderAddressCard = (
    address: Address,
    type: "billing" | "shipping"
  ) => {
    const isSelected =
      type === "billing"
        ? address.id.toString() === selectedBillingAddress
        : address.id.toString() === selectedShippingAddress;

    return (
      <div
        key={address.id}
        className={`border !font-manrope p-4 mb-4 cursor-pointer transition-all ${
          isSelected ? "border-black bg-gray-200" : "hover:border-black"
        }`}
        onClick={() => {
          if (type === "billing") {
            setSelectedBillingAddress(address.id.toString());
          } else {
            handleShippingAddressSelect(address.id.toString());
          }
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">{address.name}</h3>
            <p className="text-sm text-gray-600">{address.address}</p>
            <p className="text-sm text-gray-600">
              {address.city.name}, {address.country_state.name},{" "}
              {address.country.name}
            </p>
            <p className="text-sm text-gray-600">ZIP: {address.zip_code}</p>
            <p className="text-sm text-gray-600">Phone: {address.phone}</p>
            <p className="text-sm text-gray-600">Email: {address.email}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAddress(address.id.toString());
              }}
              className="text-gray-500 cursor-pointer hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {isSelected && (
          <div className="mt-2 text-sm text-bold text-black">
            Selected as {type} address
          </div>
        )}
      </div>
    );
  };

  const renderAddressForm = () => (
    <div className="lg:col-span-2">
      <h2 className="text-xl font-bold mb-6 uppercase">
        {activeTab === "billing" ? "Billing" : "Shipping"} Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label
            htmlFor="firstName"
            className="required-field uppercase text-[12px] "
          >
            First Name *
          </Label>
          <input
            id="firstName"
            className="mt-1 w-full px-4 py-2  border border-gray-300  font-manrope"
            value={formData.firstName}
            onChange={handleFormChange}
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="required-field uppercase">
            Last Name *
          </Label>
          <input
            id="lastName"
            className="mt-1 w-full px-4 py-3 border border-gray-300 p-2.5 h-12 font-manrope font-[600] text-[16px]"
            value={formData.lastName}
            onChange={handleFormChange}
          />
        </div>
      </div>

      <div className="mb-6">
        <Label htmlFor="companyName">Company Name (Optional)</Label>
        <input
          id="companyName"
          className="mt-1 w-full px-4 py-3 border border-gray-300 p-2.5 h-12 font-manrope font-[600] text-[16px]"
          value={formData.companyName}
          onChange={handleFormChange}
        />
      </div>

      <div className="mb-6">
        <Label htmlFor="country" className="required-field">
          Country / Region *
        </Label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={(e) => handleCountryChange(Number(e.target.value))}
          className="mt-1 w-full px-4 py-3 border border-gray-300 p-2.5 h-12 font-manrope font-[600] text-[16px]"
          required
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* State Dropdown */}
      <div className="mb-6">
        <Label htmlFor="state" className="required-field">
          State *
        </Label>
        <select
          id="state"
          name="state"
          value={formData.state}
          onChange={(e) => handleStateChange(Number(e.target.value))}
          className="mt-1 w-full px-4 py-3 border border-gray-300 p-2.5 h-12 font-manrope font-[600] text-[16px]"
          required
          disabled={!formData.country}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      {/* City Dropdown */}
      <div className="mb-6">
        <Label htmlFor="city" className="required-field">
          City *
        </Label>
        <select
          id="city"
          name="city"
          value={formData.city}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, city: e.target.value }))
          }
          className="mt-1 w-full px-4 py-3 border border-gray-300 p-2.5 h-12 font-manrope font-[600] text-[16px]"
          required
          disabled={!formData.state}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <Label htmlFor="streetAddress" className="required-field">
          Street Address
        </Label>
        <input
          id="streetAddress"
          className="mt-1 w-full px-4 py-3 border border-gray-300 p-2.5 h-12 font-manrope font-[600] text-[16px]"
          placeholder="House number and street name"
          value={formData.streetAddress}
          onChange={handleFormChange}
        />
        <input
          id="apartment"
          className="mt-2 w-full px-4 py-3 border border-gray-300 p-2.5 h-12 font-manrope font-[600] text-[16px]"
          placeholder="Apartment, suite, unit, etc. (optional)"
          value={formData.apartment}
          onChange={handleFormChange}
        />
      </div>

      <div className="mb-6">
        <Label htmlFor="zipCode" className="required-field">
          ZIP Code
        </Label>
        <input
          id="zipCode"
          className="mt-1 w-full px-4 py-3 border not-last:border-gray-300 p-2.5 h-12 font-manrope font-[600] text-[16px]"
          value={formData.zipCode}
          onChange={handleFormChange}
        />
      </div>

      <div className="mb-6">
        <Label htmlFor="phone" className="required-field">
          Phone
        </Label>
        <input
          id="phone"
          className="mt-1 w-full px-4 py-3 border border-gray-300 p-2.5 h-12 font-manrope font-[600] text-[16px]"
          value={formData.phone}
          onChange={handleFormChange}
        />
      </div>

      <div className="mb-6">
        <Label htmlFor="email" className="required-field">
          Email Address
        </Label>
        <input
          id="email"
          className="mt-1 w-full px-4 py-3 border border-gray-300 p-2.5 h-12 font-manrope font-[600] text-[16px]"
          value={formData.email}
          onChange={handleFormChange}
        />
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <Checkbox
          id="createAccount"
          checked={createAccount}
          onCheckedChange={(checked) => setCreateAccount(checked as boolean)}
        />
        <Label htmlFor="createAccount" className="cursor-pointer">
          CREATE AN ACCOUNT?
        </Label>
      </div>

      <div className="mb-6">
        <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
        <Textarea
          id="orderNotes"
          className="mt-1 w-full px-4 py-2 border border-gray-300 p-2.5 font-manrope font-[600] text-[16px]"
          placeholder="Notes about your order, e.g. special notes for delivery."
          value={formData.orderNotes}
          onChange={handleFormChange}
        />
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={handleSubmitAddress}
          className="bg-black text-white hover:bg-gray-800"
        >
          SAVE ADDRESS
        </Button>
        <Button variant="outline" onClick={() => setShowAddressForm(false)}>
          CANCEL
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="text-2xl font-bold uppercase text-center py-8 border-b-2 font-manrope">
        {" "}
        checkout{" "}
      </div>
      <div className="container lg:px-[50px] py-8 font-roboto text-[14px] font-[600]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing & Shipping Address Section */}
          {showAddressForm ? (
            renderAddressForm()
          ) : (
            <div className="lg:col-span-2">
              <div className="border p-6 mb-8">
                <div className="flex border-b mb-6">
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === "billing"
                        ? "text-black border-b-2border-gray-300"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("billing")}
                  >
                    Billing Address
                  </button>
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === "shipping"
                        ? "text-black border-b-2border-gray-300"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("shipping")}
                  >
                    Shipping Address
                  </button>
                </div>

                {activeTab === "billing" ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {checkoutData.addresses.length > 0 ? (
                        checkoutData.addresses.map((address: Address) =>
                          renderAddressCard(address, "billing")
                        )
                      ) : (
                        <p className="mb-4">
                          No saved billing addresses found.
                        </p>
                      )}{" "}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {checkoutData.addresses.length > 0 ? (
                        checkoutData.addresses.map((address: Address) =>
                          renderAddressCard(address, "shipping")
                        )
                      ) : (
                        <p className="mb-4">
                          No saved shipping addresses found.
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* <div className="flex items-center space-x-2 mb-6">
                <Checkbox
                  id="different-shipping"
                  checked={shipToDifferentAddress}
                  onCheckedChange={(checked) => {
                    setShipToDifferentAddress(checked as boolean);
                    if (checked) {
                      setActiveTab("shipping");
                    } else {
                      setActiveTab("billing");
                    }
                  }}
                />
                <Label htmlFor="different-shipping">
                  Ship to a different address?
                </Label>
              </div> */}

                <Button
                  variant="outline"
                  className="w-full font-manrope font-semibold py-2 cursor-pointer"
                  onClick={() => setShowAddressForm(true)}
                >
                  + ADD NEW ADDRESS
                </Button>
              </div>
            </div>
          )}

          {/* Order Summary Section */}
          <div className="lg:col-span-1 font-manrope">
            <div className="border p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-amber-500 font-medium">
                    COUPON CODE
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowCouponInput(!showCouponInput)}
                  >
                    {showCouponInput ? (
                      <Minus className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                {showCouponInput && (
                  <div className="mt-4 border-t pt-4">
                    {appliedCoupon ? (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold text-green-700">
                              {appliedCoupon.name} ({appliedCoupon.code})
                            </span>
                            <span className="block text-sm text-green-600">
                              {appliedCoupon.discount}% discount applied
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveCoupon}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex">
                        <input
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 p-2.5 h-12 font-manrope font-[600] text-[16px] rounded-none"
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          className="rounded-l-none cursor-pointer h-12 px-6" // Added h-12 and px-6
                        >
                          APPLY
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold mb-6">YOUR ORDER</h2>

              {checkoutData.cartProducts.map((item: CartProduct) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-4"
                >
                  <span className="text-xs md:text-sm">
                    {item.product.short_name} × {item.qty}
                  </span>
                  <span className="font-medium">
                    {currency_icon}
                    {/* Show offer price if available, otherwise fall back to regular price */}
                    {(item.product.offer_price || item.product.price) *
                      item.qty}
                  </span>
                </div>
              ))}

              <div className="flex justify-between items-center py-4 border-t border-b mb-4">
                <span className="font-medium">SUBTOTAL</span>
                <span className="font-medium">
                  {currency_icon}
                  {subtotal}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">
                    DISCOUNT ({appliedCoupon.code})
                  </span>
                  <span className="font-medium text-green-600">
                    -{currency_icon}
                    {((subtotal * appliedCoupon.discount) / 100).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-medium mb-4">SHIPPING</h3>
                {loadingPincode ? (
                  <div>Checking serviceability...</div>
                ) : pincodeCheck ? (
                  <>
                    {!pincodeCheck.serviceable ? (
                      <div className="text-red-500 mb-4">
                        Sorry, we don`&apos;`t deliver to this address
                      </div>
                    ) : (
                      <>
                        <div className="mb-2">
                          <span className="font-bold">Shipping Cost: </span>
                          <span>
                            {currency_icon}
                            {pincodeCheck.shippingCost}
                          </span>
                        </div>
                        {/* <div className="mb-4">
                          <span className="font-medium">Shipping Rule: </span>
                          <span>{pincodeCheck.shippingRule}</span>
                        </div> */}
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-red-600 text-xl">
                    Select a shipping address to check serviceability
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center py-4 border-t border-b mb-6">
                <span className="font-medium">TOTAL</span>
                <span className="font-bold text-xl">
                  {currency_icon}
                  {appliedCoupon
                    ? (total * (1 - appliedCoupon.discount / 100)).toFixed(2)
                    : total.toFixed(2)}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-4">PAYMENT METHOD</h3>
                <RadioGroup
                  value={selectedPaymentMethod}
                  onValueChange={setSelectedPaymentMethod}
                >
                  {availablePaymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center space-x-2 mb-3 p-3 border rounded-md"
                    >
                      <RadioGroupItem
                        value={method.id}
                        id={method.id}
                        // disabled={
                        //   // Disable other payment methods if COD is selected
                        //   (selectedPaymentMethod === "cod" &&
                        //     method.id !== "cod") ||
                        //   // Disable COD if any other payment method is selected
                        //   (selectedPaymentMethod !== "cod" &&
                        //     selectedPaymentMethod !== "" &&
                        //     method.id === "cod")
                        // }
                      />
                      <Label htmlFor={method.id} className="flex items-center">
                        {method.id === "cod" ? (
                          method.label
                        ) : (
                          <>
                            <Image
                              src={`/payment-partners/${method.id}.png`}
                              alt={method.label}
                              width={250}
                              height={100}
                              className="mr-2"
                            />
                          </>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) =>
                      setTermsAccepted(checked as boolean)
                    }
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I have read and agree to the website{" "}
                    <a href="#" className="underline">
                      terms and conditions
                    </a>{" "}
                    *
                  </Label>
                </div>
              </div> */}

              {orderError && (
                <div className="text-red-500 mb-4 text-center">
                  {orderError}
                </div>
              )}

              {/* Add this after the payment methods section */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block cursor-pointer w-full">
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={
                          !selectedShippingAddress ||
                          !selectedPaymentMethod ||
                          (pincodeCheck && !pincodeCheck.serviceable) ||
                          placingOrder
                        }
                        className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg"
                      >
                        {placingOrder ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          "PLACE ORDER"
                        )}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!selectedPaymentMethod && (
                    <TooltipContent className="bg-black text-white">
                      <p>Please select a payment method</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Tooltip */}

      {showStripeForm && orderDetails && stripePromise && (
        <StripePaymentForm
          stripePromise={stripePromise}
          orderDetails={orderDetails}
          amount={orderDetails.amount}
          onSuccess={() => {
            toast.success("Payment successful!");
            router.push(
              `/payment-status?order_id=${orderDetails.order.order_id}`
            );
          }}
          onClose={() => setShowStripeForm(false)}
        />
      )}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.2}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl animate-bounce">
              <h3 className="text-xl font-bold text-green-600 mb-2">
                Coupon Applied!
              </h3>
              <p className="text-gray-700">
                You got {appliedCoupon?.discount}% off with{" "}
                {appliedCoupon?.code}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withAuth(CheckoutPage, {
  redirectTo: "/sign-in",
  requireAuth: true,
  authMessage: "Please sign in to view your orders",
});
