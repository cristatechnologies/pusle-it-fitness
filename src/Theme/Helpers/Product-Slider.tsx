"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import { Tabs, TabsList, TabsTrigger } from "../shadcn/components/ui/tabs";
import QuickViewModal from "./Quick-View-Modal";
import ProductCardSlider from "./Product-Card-Slider";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import {
  CategoryWithProducts,
  Product,
} from "@/lib/redux/features/homepage/types";
import { Navigation } from "swiper/modules";


interface ProductSliderProps {
  data?: CategoryWithProducts[];
  title?: string;
}

export default function ProductSlider({ data,title }: ProductSliderProps) {


  
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024 // Default to desktop size
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 

  
  useEffect(() => {
    if (!data || data.length === 0) return;
    setActiveCategory(data[0].slug);

    // Set initial window width
    setWindowWidth(window.innerWidth);

    // Add resize listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data]);

  const handlePrev = () => {
    if (swiper) {
      swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeQuickView = () => {
    setIsModalOpen(false);
  };

  if (!data || data.length === 0) {
    return null;
  }

  const shouldShowTabs = data.length > 1;
  const currentCategory =
    data.find((cat) => cat.slug === activeCategory) || data[0];

  // Determine whether to show slider based on screen size and product count
  const shouldShowSlider = () => {
    const productCount = currentCategory.products.length;

    if (windowWidth < 768) {
      // sm: always show slider with 1 product per row
      return true;
    } else if (windowWidth < 1024) {
      // md: show slider if 3 or more products
      return productCount >= 3;
    } else {
      // lg and xl: show slider if 5 or more products
      return productCount >= 5;
    }
  };

  return (
    <div className="relative bg-[#f8f8f8] pb-10">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center uppercase mb-8 text-[var(--primary-text-color)] font-manrope">
          {title || "Products"}
        </h2>

        {shouldShowTabs && (
          <Tabs
            defaultValue={data[0].slug}
            className="w-full"
            onValueChange={setActiveCategory}
          >
            <div className="flex justify-center">
              <TabsList className="mb-6 bg-transparent flex w-1/2 justify-center rounded-none h-auto p-0 space-x-2 border-b border-gray-200">
                {data.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.slug}
                    className="py-3 px-1 text-gray-400 bg-none border-none font-semibold data-[state=active]:text-black  data-[state=active]:underline-offset-4 data-[state=active]:decoration-2 data-[state=active]:bg-none data-[state=active]:border-none rounded-none shadow-none"
                  >
                    {category.name.toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        )}

        {data.map((category) => (
          <div
            key={category.id}
            className={activeCategory !== category.slug ? "hidden" : ""}
          >
            {shouldShowSlider() ? (
              <div className="relative">
                {windowWidth >= 768 && (
                  <>
                    <button
                      className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center"
                      onClick={handlePrev}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center"
                      onClick={handleNext}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                  spaceBetween={0}
                  slidesPerView={windowWidth < 768 ? 1 : "auto"}
                  onSwiper={setSwiper}
                  grabCursor={true}
                  className="mySwiper"
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                      spaceBetween: 0,
                    },
                    768: {
                      slidesPerView: Math.min(category.products.length, 3),
                      spaceBetween: 0,
                    },
                    1024: {
                      slidesPerView: Math.min(category.products.length, 4), // Changed from 5 to 4
                      spaceBetween: 0,
                    },
                    1280: {
                      slidesPerView: Math.min(category.products.length, 4), // Changed from 5 to 4
                      spaceBetween: 0,
                    },
                  }}
                >
                  {category.products.map((product) => (
                    <SwiperSlide
                      key={product.id}
                      style={{
                        width: "auto",
                        marginRight: "0 !important", // Force no margin
                      }}
                    >
                      <ProductCardSlider
                        product={product}
                        isHovered={hoveredProduct === product.id}
                        onMouseEnter={() => setHoveredProduct(product.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                        categorySlug={category.slug}
                        onQuickView={() => openQuickView(product)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div
                className={`grid ${
                  windowWidth < 768
                    ? "grid-cols-1"
                    : windowWidth < 1024
                    ? "grid-cols-3"
                    : "grid-cols-5"
                } gap-4`}
              >
                {category.products.map((product) => (
                  <ProductCardSlider
                    key={product.id}
                    product={product}
                    categorySlug={category.slug}
                    isHovered={hoveredProduct === product.id}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    onQuickView={() => openQuickView(product)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        <QuickViewModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeQuickView}
        />
      </div>
    </div>
  );
}
