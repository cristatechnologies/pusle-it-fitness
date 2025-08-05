"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/Theme/shadcn/components/ui/breadcrumb";

import Link from "next/link";
import RelatedProducts from "./components/Related-Products";
import { Fragment } from "react";
import { addToWishlist,removeFromWishlist,fetchWishlist } from "@/lib/redux/features/wishlist/thunks";
import { settings } from "@/lib/redux/features/website/settings";
import { addToCart } from "@/services/cart";
import { useAppSelector } from "@/lib/redux/hook";
import { isProductInCart } from "@/lib/redux/features/cart/utils";
import { ProductPageProps } from "@/app/shop/[category]/[product]/types/types";
import SocialShareComponent from "@/Theme/Helpers/share-component";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/lib/redux/store";
import { checkAuthBeforeAction } from "../../../../../middleware/isAuth";
import toast from "react-hot-toast";





export default function ProductPage({ productData }: ProductPageProps) {

  

  const socialUrl = window.location.href
  const websiteData = useAppSelector((state) => state.website.data);
  const wishlistData = useAppSelector((state) => state.wishlist.data);
  const dispatch = useDispatch<AppDispatch>();

  const {
    product,
    relatedProducts,
    productReviews,
    gellery,
    specifications = [],
  } = productData;

  

  const [quantity, setQuantity] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<
    "description" | "additional" | "reviews"
  >("description");
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [saveInfo, setSaveInfo] = useState<boolean>(false);
  const [showPrice, setShowPrice] = useState<boolean>(true);
  const [isInWishlist, setIsInWishlist] = useState(() => {
    if (!wishlistData?.wishlists?.data) return false;
    return wishlistData.wishlists.data.some(
      (item) => item.product_id === productData.product.id
    );
  });
  const activeVariants = product.active_variants || [];
  const [selectedVariantItems, setSelectedVariantItems] = useState<
    Record<number, number>
  >({});
  const [variantError, setVariantError] = useState<string | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  // Create gallery images array from product data
  const galleryImages = [
    product.thumb_image,
    ...(gellery?.map((item) => item.image) || []),
  ];
  const selectedImage = galleryImages[currentImageIndex];
  const cart = useAppSelector((state) => state.cart);
 

  const selectedVariantItemIds = Object.values(selectedVariantItems);
  const productInCart = isProductInCart(
    cart,
    product.id,
    selectedVariantItemIds
  );
  const { currency_icon } = settings();
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Get color and size variants

  


const toggleWishlist = async () => {
  checkAuthBeforeAction(async () => {
    try {
      setWishlistLoading(true);
      if (isInWishlist) {
        // Find the wishlist item to get its ID
        const wishlistItem = wishlistData?.wishlists?.data?.find(
          (item) => item.product_id === product.id
        );
        if (wishlistItem) {
          await dispatch(removeFromWishlist(wishlistItem.id)).unwrap();
          toast.success("Removed from wishlist");
        }
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
        toast.success("Added to wishlist");
      }
      // Refresh the wishlist data
      dispatch(fetchWishlist());
    } catch (err) {
      console.log(err);
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  });
};
  const handleAddToCart = async () => {
    // Check if all variants are selected

   
    
    const missingVariants = activeVariants.filter(
      (variant) => !selectedVariantItems[variant.id]
    );

    if (missingVariants.length > 0) {
      setVariantError(
        `Please select ${missingVariants.map((v) => v.name).join(" and ")}`
      );
      return;
    }

    setVariantError(null);

    // Prepare variant data for API
    const variantData = Object.entries(selectedVariantItems).map(
      ([variantId, itemId]) => ({
        variantId: Number(variantId),
        itemId: Number(itemId),
      })
    );

    // Call the addToCart function
    const success = await addToCart(product.id, quantity, variantData);

    if (success) {
      // Optional: Reset quantity or show success message
      setQuantity(1);
    }
  };
  


  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle review submission logic here
   toast.success("Review submitted successfully!");

    // Reset form
    setRating(0);
    setReviewText("");
    setName("");
    setEmail("");
    setSaveInfo(false);
  };

  const calculatePrice = () => {
    let finalPrice = product.offer_price || product.price;

    // Add any selected variant item prices
    Object.values(selectedVariantItems).forEach((variantItemId) => {
      activeVariants.forEach((variant) => {
        const selectedItem = variant.active_variant_items.find(
          (item) => item.id === variantItemId
        );
        if (selectedItem) {
          finalPrice += selectedItem.price;
        }
      });
    });

    return finalPrice;
  };

  const handleVariantItemSelect = (variantId: number, itemId: number) => {
    setSelectedVariantItems((prev) => ({
      ...prev,
      [variantId]: itemId,
    }));
  };


  

  useEffect(() => {
    if (!wishlistData?.wishlists?.data) {
      setIsInWishlist(false);
      return;
    }
    const inWishlist = wishlistData.wishlists.data.some(
      (item) => item.product_id === productData.product.id
    );
    setIsInWishlist(inWishlist);
  }, [wishlistData, productData.product.id]);

  useEffect(() => {
    if (websiteData?.catalog_mode?.show_price === 1) {
      setShowPrice(true);
    } else {
      setShowPrice(false);
    }
  }, [websiteData?.catalog_mode?.show_price]);

  const breadcrumbSegments = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    ...(product.category
      ? [
          {
            name: product.category.name,
            href: `/shop/${product.category.slug}`,
          },
        ]
      : []),
    { name: product.name, href: `#` }, // Current page doesn't need a link
  ];
  


 
  return (
    <div className="font-manrope">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden border rounded">
              <button
                onClick={prevImage}
                className="absolute cursor-pointer left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[var(--primary-color)] border border-gray-200 flex items-center justify-center"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <Image
                src={
                  `${process.env.NEXT_PUBLIC_BASE_URL}${selectedImage}` ||
                  "/placeholder.svg"
                }
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <button
                onClick={nextImage}
                className="absolute right-2 cursor-pointer top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[var(--primary-color)] border border-gray-200 flex items-center justify-center"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 cursor-pointer border cursor-pointer ${
                    currentImageIndex === index
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <Image
                    src={
                      `${process.env.NEXT_PUBLIC_BASE_URL}${image}` ||
                      "/placeholder.svg"
                    }
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 font-manrope">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList className="text-sm">
                  {breadcrumbSegments.map((segment, index) => (
                    <Fragment key={index}>
                      <BreadcrumbItem>
                        {index < breadcrumbSegments.length - 1 ? (
                          <BreadcrumbLink
                            asChild
                            className="uppercase hover:text-[var(--hover-color)] text-sm"
                          >
                            <Link href={segment.href} className=" ">
                              {segment.name}
                            </Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage className="hover:text-[var(--hover-color)] text-sm">
                            {segment.name}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbSegments.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold">
              {product.name}
            </h1>
            {showPrice && (
              <div className="text-[17px] font-bold">
                {product.offer_price ? (
                  <>
                    <span className="line-through text-gray-500 mr-2">
                      {currency_icon}
                      {product.price}
                    </span>
                    <span>
                      {currency_icon}
                      {calculatePrice()}
                    </span>
                  </>
                ) : (
                  <span>
                    {currency_icon}
                    {calculatePrice()}
                  </span>
                )}
              </div>
            )}

            <p className="text-gray-600 text-[14px]">
              {product.short_description}
            </p>

            {variantError && (
              <div className="text-red-500 text-sm mb-4">{variantError}</div>
            )}
            {activeVariants.map((variant) => (
              <div key={variant.id} className="space-y-3">
                <h3 className="font-medium uppercase">{variant.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {variant.active_variant_items.map((item) => (
                    <button
                      key={item.id}
                      className={`px-4 py-2 border text-sm ${
                        selectedVariantItems[variant.id] === item.id
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() =>
                        handleVariantItemSelect(variant.id, item.id)
                      }
                    >
                      {item.name}{" "}
                      {showPrice && `(+${currency_icon}${item.price})`}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity and Add to Cart */}
            {showPrice && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center border">
                  <button
                    className="px-3 py-2 cursor-pointer border-r"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    className="px-3 py-2 cursor-pointer border-l"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {productInCart ? (
                  <Link
                    href="/cart"
                    className="bg-[var(--secondary-color)] text-[var(--secondary-text-color)]  hover:text-white hover:bg-[var(--hover-color)] px-8 py-2 h-auto !rounded-0 text-center"
                  >
                    GO TO CART
                  </Link>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="bg-[var(--secondary-color)] text-[var(--secondary-text-color)] hover:text-white hover:bg-[var(--hover-color)] cursor-pointer px-8 py-2 h-auto !rounded-0"
                  >
                    ADD TO CART
                  </button>
                )}
              </div>
            )}

            {showPrice && (
              <div className="flex space-x-6">
                <button
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  className="flex items-center text-sm cursor-pointer"
                  aria-label={
                    isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      isInWishlist ? "fill-current" : ""
                    } ${wishlistLoading ? "opacity-50" : ""}`}
                    fill={isInWishlist ? "currentColor" : "none"}
                  />
                  {wishlistLoading
                    ? "PROCESSING..."
                    : isInWishlist
                    ? "REMOVE FROM WISHLIST"
                    : "ADD TO WISHLIST"}
                </button>
                <div className="flex items-center text-sm cursor-pointer">
                  <SocialShareComponent
                    socialUrl={socialUrl}
                    title="Check this out!"
                  />
                  Share
                </div>
              </div>
            )}

            {/* Product Info */}
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="w-24 text-gray-500">SKU:</span>
                <span>{product.sku || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-500">CATEGORY:</span>
                <Link href={`/shop/${product.category?.name}`}>
                  {product.category?.name || "N/A"}
                </Link>
              </div>
              {/* {product.brand && (
                <div className="flex">
                  <span className="w-24 text-gray-500">BRAND:</span>
                  <Link href={`/brands/${product.brand.name}`}>
                    {product.brand.name}
                  </Link>
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* Description and Reviews Side by Side */}
        {/* Custom Tabs Section */}
        {/* Description and Reviews Side by Side */}
        {/* Custom Tabs Section */}
        <div className="mt-16">
          {/* Tabs Navigation */}
          <div className="flex border-b items-center justify-center space-x-2 md:space-x-8 overflow-x-auto whitespace-nowrap">
            <button
              className={`uppercase px-4 py-3 cursor-pointer hover:text-black font-manrope font-[700] text-xs md:text-[14px] ${
                activeTab === "description"
                  ? "border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`uppercase px-4 py-3 cursor-pointer hover:text-black font-[700] text-xs md:text-[14px] ${
                activeTab === "additional"
                  ? "border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("additional")}
            >
              Additional Information
            </button>
            <button
              className={`uppercase px-4 py-3 cursor-pointer hover:text-black font-[700] text-xs md:text-[14px] ${
                activeTab === "reviews"
                  ? "border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews{" "}
              {productReviews.length !== 0
                ? `(${productReviews.length})`
                : null}
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-8 w-full">
            {/* Description Tab */}
    {/* Description Tab */}
{activeTab === "description" && (
  <div className="w-full px-4 md:px-0">
    <div 
      className="text-gray-700 w-full max-w-full"
      dangerouslySetInnerHTML={{
        __html: product.long_description,
      }}
      style={{
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        maxWidth: '100%',
      }}
    />
    <ul className="mt-6 space-y-2 list-none">
      {product.height && (
        <li className="flex items-center">
          <span className="text-gray-500 mr-2">•</span>
          Height: {product.height} cm
        </li>
      )}
      {product.width && (
        <li className="flex items-center">
          <span className="text-gray-500 mr-2">•</span>
          Width: {product.width} cm
        </li>
      )}
      {product.weight && (
        <li className="flex items-center">
          <span className="text-gray-500 mr-2">•</span>
          Weight: {product.weight} kg
        </li>
      )}
    </ul>
  </div>
)}

            {/* Additional Information Tab */}
            {activeTab === "additional" && (
              <div className="w-full px-4 md:px-0">
                <div className="text-gray-700 space-y-4 w-full max-w-2xl mx-auto">
                  {product.category && (
                    <div className="flex flex-col md:flex-row">
                      <span className="font-medium md:mr-2 md:w-32">
                        CATEGORY:
                      </span>
                      <span>{product.category.name}</span>
                    </div>
                  )}
                  {product.brand_id && (
                    <div className="flex flex-col md:flex-row">
                      <span className="font-medium md:mr-2 md:w-32">
                        BRAND:
                      </span>
                      {/* <span>{product.brand.name}</span> */}
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex flex-col md:flex-row">
                      <span className="font-medium md:mr-2 md:w-32">SKU:</span>
                      <span>{product.sku}</span>
                    </div>
                  )}
                  {product.hsn_code && (
                    <div className="flex flex-col md:flex-row">
                      <span className="font-medium md:mr-2 md:w-32">
                        HSN CODE:
                      </span>
                      <span>{product.hsn_code}</span>
                    </div>
                  )}

                  {/* Add specifications section */}
                  {specifications?.length > 0 && (
                    <div className="mt-6 w-full overflow-x-auto">
                      <h4 className="font-bold mb-4">SPECIFICATIONS</h4>
                      <table className="w-full border-collapse min-w-[600px]">
                        <tbody>
                          {specifications.map((spec, index) => (
                            <tr
                              key={spec.id}
                              className={index % 2 === 0 ? "bg-gray-50" : ""}
                            >
                              <td className="py-2 px-4 border border-gray-200 font-medium md:w-1/3">
                                {spec.key.key}
                              </td>
                              <td className="py-2 px-4 border border-gray-200">
                                {spec.specification}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="w-full px-4 md:px-0">
                {/* Reviews List */}
                <div className="space-y-8 mb-12 max-w-2xl mx-auto">
                  {productReviews.length > 0 ? (
                    productReviews.map((review) => (
                      <div key={review.id} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                            <Image
                              src="/placeholder.svg"
                              alt={review.user_id?.toString() || "User"}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "fill-black text-black"
                                      : "fill-gray-200 text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium">
                              User {review.user_id}
                            </span>
                            {review.created_at && (
                              <span className="text-gray-400 text-xs uppercase">
                                {new Date(review.created_at)
                                  .toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700">{review.review}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </div>

                {/* Add Review Form */}
                <div className="max-w-2xl mx-auto">
                  <h3 className="font-bold text-lg mb-4">ADD A REVIEW</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Your email address will not be published. Required fields
                    are marked *
                  </p>

                  <form className="space-y-6" onSubmit={handleSubmitReview}>
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-sm mr-2 uppercase font-medium">
                          YOUR RATING *
                        </span>
                        <div
                          className="flex"
                          onMouseLeave={() => setHoveredRating(0)}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 cursor-pointer ${
                                star <= (hoveredRating || rating)
                                  ? "fill-black text-black"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoveredRating(star)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <textarea
                        placeholder="Your review *"
                        className="w-full min-h-[150px] resize-none border border-gray-300 p-3 focus:outline-none focus:border-black"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Name *"
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email *"
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="save-info"
                        className="mt-1"
                        checked={saveInfo}
                        onChange={(e) => setSaveInfo(e.target.checked)}
                      />
                      <label htmlFor="save-info" className="text-sm">
                        Save my name, email, and website in this browser for the
                        next time I comment.
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="bg-black hover:bg-gray-800 text-white px-8 py-2"
                    >
                      SUBMIT
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts relatedProducts={relatedProducts} />
        </div>
      </div>
    </div>
  );
}
