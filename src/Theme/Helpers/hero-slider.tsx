"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hook";
import { Button } from "../shadcn/components/ui/button";




interface Slide {
  id: number;
  badge: string | null;
  title_one: string | null;
  title_two: string | null;
  image: string;
  status: number;
  serial: number;
  slider_location: string | null;
  product_slug: string | null;
  created_at: string;
  updated_at: string;
}

export default function HeroSlider() {
  const slides: Slide[] = useAppSelector(
    (state) => state.homepage.data?.sliders || []
  );
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (slides.length === 0) return null; // Avoid rendering if no data

  return (
    <div className="relative h-[250px]  w-full overflow-hidden mt-0">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL}${slide.image})`, // Adjust prefix if needed
            backgroundSize: "cover",
            backgroundRepeat:"no-repeat"
           
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-black font-manrope">
            <div className="max-w-3xl px-4">
              {slide.title_one && (
                <h1 className="mb-6 text-5xl font-bold tracking-tight">
                  {slide.title_one}
                </h1>
              )}
              {slide.title_two && (
                <p className="mb-8 text-xl">{slide.title_two}</p>
              )}
            </div>
            {slide.badge && slide.product_slug && (
              <Button
                asChild
                variant="outline"
                className="border-2 border-black bg-white px-8 py-6 text-sm font-semibold text-black hover:bg-black hover:text-white"
              >
                <a href={`/shop/${slide.product_slug}`}>{slide.badge}</a>
              </Button>
            )}
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      {/* <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black hover:bg-white"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black hover:bg-white"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button> */}

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-8 rounded-full transition-colors ${
              index === currentSlide ? "bg-black" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
