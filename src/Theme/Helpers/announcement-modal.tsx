// components/AnnouncementModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hook";
import { Button } from "../shadcn/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";

const AnnouncementModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const websiteSetup = useAppSelector((state) => state.website.data);
  const announcementModal = websiteSetup?.announcementModal;

  useEffect(() => {
    // Check if modal is active (status = 1) and user hasn't seen it yet
    const hasSeenModal = localStorage.getItem("hasSeenAnnouncementModal");
    if (!hasSeenModal && announcementModal?.status === 1) {
      setIsOpen(true);
    }
  }, [announcementModal]);

  const handleClose = () => {
    setIsOpen(false);
    // Remember that user has seen the modal
    localStorage.setItem("hasSeenAnnouncementModal", "true");
  };

  const handleClaimOffer = () => {
    // Add your offer claim logic here
    window.location.href = "/shop"; // Example: redirect to shop page
  };

  if (!isOpen || !announcementModal || announcementModal.status !== 1)
    return null;

  return (
    <div className="!font-manrope fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 cursor-pointer rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Banner Image */}
        {announcementModal.image && (
          <div className="relative h-64 w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${announcementModal.image}`}
              alt="Special Offer"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {announcementModal.title && (
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {announcementModal.title}
            </h3>
          )}
          {announcementModal.description && (
            <p className="text-gray-600 mb-6 text-center">
              {announcementModal.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-50 px-8 py-3"
            >
              No Thanks
            </Button>
            <Button
              onClick={handleClaimOffer}
              className="bg-gradient-to-r cursor-pointer from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all"
            >
              Claim Your Offer Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
