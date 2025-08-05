"use client"

import { useAppSelector } from "@/lib/redux/hook";


export default function MaintenancePage() {
  const websiteData = useAppSelector((state) => state.website.data);

  if (!websiteData?.maintainance) return null;

  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/Theme-1/maintainence-mode.jpg')", // Replace with your image path
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 text-white font-manrope text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          WE WILL OPENING SOON
        </h1>
        <p className="text-lg md:text-base text-gray-300 mb-12 max-w-2xl">
          Thank you for visiting our website! We are excited to announce that we
          will be opening soon. Our team is working hard behind the scenes to
          bring you the latest fashion trends and styles.
        </p>
        <button className="bg-white text-black py-3 px-6 rounded hover:bg-gray-200 transition-all font-semibold">
          NOTIFY ME
        </button>
      </div>
    </div>
  );

}
