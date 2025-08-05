"use client";

import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shadcn/components/ui/tooltip";
import Link from "next/link";
import { settings } from "@/lib/redux/features/website/settings";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
const {logo, store_name} = settings();
  // Focus the input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-y-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Header with logo and close button */}
        <div className="flex justify-between items-center">
          <Link href="/" className="text-lg font-bold tracking-widest">
            {logo !== "" ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${logo}`}
                alt="Logo"
                className="h-8 w-auto object-contain"
              />
            ) : (
              <p className=" uppercase tracking-tight font-manrope "> {store_name}</p>
            )}
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 hover:scale-105 cursor-pointer rounded-full"
                  aria-label="Close search"
                  role="button"
                >
                  <X size={24} />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-black">Close</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Search heading and input */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-4xl text-bold mb-8 font-manrope">
            What Are You Looking For?
          </h1>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Start typing..."
              className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-black text-lg font-manrope"
            />
          </div>
        </div>

        {/* Background text */}
        <div className="fixed bottom-0 right-0 text-[20vw] font-bold text-gray-50 leading-none z-[-1] pointer-events-none">
          TABLES
        </div>
      </div>
    </div>
  );
}
