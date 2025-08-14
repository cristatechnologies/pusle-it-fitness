import React from "react";
import Marquee from "react-fast-marquee";
import { useAppSelector } from "@/lib/redux/hook";


export default function AnnouncementMarquee() {

  const service = useAppSelector(
    (state) => state.homepage.data?.services)

   


  return (
    <div className="w-full  ">
      <Marquee
        speed={60}
        gradient={false}
        pauseOnHover={true}
        loop={100}
        className="py-2"
      >
        {service?.map((item, index) => (
          <div
            key={index}
            className="inline-block font-manrope   bg-[#f8f8f8]   font-semibold text-[15px] leading-[15px] tracking-wide mx-4"
          >
            <span className="mx-2">•</span>
            {item.description}
          </div>
        ))}
      </Marquee>
    </div>
  );
}
