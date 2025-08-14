// Theme/page-components/Home/page.tsx
"use client";

import React from "react";
import AnnouncementMarquee from "@/Theme/Helpers/service-marque";
import ProductSlider from "@/Theme/Helpers/Product-Slider";
import HeroSlider from "@/Theme/Helpers/hero-slider";

import { useAppSelector } from "@/lib/redux/hook";
import AnnouncementModal from "@/Theme/Helpers/announcement-modal";
import { useState } from "react";
import CategoriesSpherical from "@/Theme/Helpers/categories-spherical";

type SectionTitles = { [key: string]: string };

// interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   icon: string;
//   image: string;
// }

const HomePage = () => {
  const homepageData = useAppSelector((state) => state.homepage.data);
  const [sectionTitles] = useState<SectionTitles>(() => {
    const titles: SectionTitles = {};
    homepageData?.section_title?.forEach((item) => {
      titles[item.key] = item.custom || item.default;
    });
    return titles;
  });









  // Helper function to render only ProductSliders
  const renderContent = () => {
    const productSliders = [
      {
        data: homepageData?.popularCategoryProducts,
        title: sectionTitles?.Popular_Category,
      },
      {
        data: homepageData?.topRatedProducts,
        title: sectionTitles?.Top_Rated_Products,
      },
      {
        data: homepageData?.newArrivalProducts,
        title: sectionTitles?.New_Arrivals,
      },
      {
        data: homepageData?.featuredCategoryProducts,
        title: sectionTitles?.Featured_Products,
      },
      { data: homepageData?.bestProducts, title: sectionTitles?.Best_Products },
    ].filter
    ((slider) => slider.data); // Only include sliders with data

    console.log(productSliders);
    return productSliders.map((slider, index) => (
      <ProductSlider
        key={`slider-${index}`}
        data={slider.data}
        title={slider.title}
      />
    ));
  };



  return (
    <main className="space-y-5">
      <AnnouncementModal />
      <HeroSlider />
      <AnnouncementMarquee />
      <CategoriesSpherical featuredCategories={homepageData?.featuredCategories || []}/> 
      {renderContent()}
    </main>
  );
};

export default HomePage;
