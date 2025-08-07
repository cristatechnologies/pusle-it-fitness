"use client";
import { useState, useEffect, } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, Heart, LogIn, LogOut,ChevronDown } from "lucide-react";
import MobileMenuDrawer from "./MobileMenuDrawer";
import { useAppSelector } from "@/lib/redux/hook";
import { useCart } from "@/context/Cart-Context";
import SearchOverlay from "./SearchOverlay";

import { settings } from "@/lib/redux/features/website/settings";
import { getAuthToken } from "@/services/Auth-Token";
import { logoutUser } from "@/services/authApi";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../shadcn/components/ui/tooltip";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";


export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const websiteData = useAppSelector((state) => state.website.data);
  const { openCart } = useCart();
  // const social_icons = websiteData?.social_links;
  const { logo, store_name } = settings();
  // const footerData = websiteData?.footer;
  const token = getAuthToken();
  const isHomePage = pathname === "/";
  
  useEffect(() => {
    // Only add scroll listener if it's the home page
    if (isHomePage) {
      const handleScroll = () => {
        if (window.scrollY > 0) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      // On non-home pages, always sticky
      setIsSticky(true);
    }
  }, [isHomePage]); // Add isHomePage as dependency

  const Logout = async () => {
    const response = await logoutUser();
    if (response) {
      toast.success("Logout successful.");
      router.push("/sign-in");
      localStorage.removeItem("auth");
    } else {
      toast.error("Logout failed. Please try again.");
    }
  };

 

  return (
    <>
      {/* Free shipping banner - always at the top and not sticky */}
      {/* <div className="font-manrope bg-black w-full text-white text-center py-2 text-sm font-medium">
        Free Shipping on All Orders
      </div> */}
      {/* Main header that becomes sticky on scroll */}
      <header
        className={`font-manrope w-full hidden lg:block ${
          isSticky
            ? "fixed top-0 left-0 right-0 z-50 bg-[var(--primary-color)] shadow-md"
            : "absolute top-0 left-0 right-0 z-50 bg-transparent text-[var(--secondary-text-color)]"
        }`}
      >
        {/* Navigation bar */}
        <nav
          className={`font-manrope border-t border-b ${
            isSticky
              ? "bg-white border-gray-200"
              : isHomePage
              ? "bg-transparent border-transparent"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="container mx-auto flex items-center justify-between px-4">
            {/* Logo  */}
            <Link href="/" className="text-lg font-bold tracking-widest">
              {logo !== "" ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${logo}`}
                  alt="Logo"
                  height={60}
                  width={60}
                  className=""
                />
              ) : (
                <p className="capitalize"> {store_name}</p>
              )}
            </Link>

            {/* Main navigation */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="py-4 text-[12px] font-semibold">
                HOME
              </Link>
              <NavItem
                label="SHOP"
                categories={websiteData?.productCategories}
                isSticky={isSticky}
              />
              {/* <NavItem label="BLOG" /> */}
              <Link
                href="/about-us"
                className="py-4  cursor-pointer  text-[12px] font-semibold"
              >
                ABOUT US
              </Link>
              <Link
                href="/blog"
                className="py-4  cursor-pointer  text-[12px] font-semibold"
              >
               BLOGS
              </Link>
              <Link
                href="/contact-us"
                className="py-4  cursor-pointer  text-[12px] font-semibold"
              >
                CONTACTS
              </Link>
            </div>

            {/* Address and hours */}
            <div
              className={`flex items-center space-x-4 ${
                isSticky ? "text-white " : "text-gray-600"
              }`}
            >
              {token ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={Logout}
                      className={`hover:text-gray-900 cursor-pointer ${
                        isSticky ? "text-gray-600" : "text-white"
                      }`}
                    >
                      <LogOut size={20} />
                      <span className="sr-only">Logout</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/sign-in"
                      className={`hover:text-gray-900 ${
                        isSticky ? "text-gray-600" : "text-white"
                      }`}
                    >
                      <LogIn size={20} />
                      <span className="sr-only">Login</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Login</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/profile/dashboard"
                    className={`hover:text-gray-900 ${
                      isSticky ? "text-gray-600" : "text-white"
                    }`}
                  >
                    <User size={20} />
                    <span className="sr-only">Account</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Account</p>
                </TooltipContent>
              </Tooltip>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSearchOpen(true);
                }}
                className={`hover:text-gray-900 ${
                  isSticky ? "text-gray-600" : "text-white"
                }`}
              >
                <Search size={20} />
                <span className="sr-only">Search</span>
              </Link>
              <Link
                href="/wishlist"
                className={`hover:text-gray-900 ${
                  isSticky ? "text-gray-600" : "text-white"
                }`}
              >
                <Heart size={20} />
                <span className="sr-only">Wishlist</span>
              </Link>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openCart();
                }}
                className={`hover:text-gray-900 ${
                  isSticky ? "text-gray-600" : "text-white"
                }`}
              >
                <ShoppingBag size={20} />
                <span className="sr-only">Cart</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>
      {/* Mobile header */}
      <header
        className={`w-full flex items-center justify-between px-4 py-2 lg:hidden border-b ${
          isSticky || !isHomePage
            ? "fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
            : "absolute top-0 left-0 right-0 z-50 bg-transparent"
        }`}
      >
        {/* Hamburger menu button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-gray-700"
        >
          {/* Hamburger icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* Logo in center */}
        <Link href="/" className="text-lg font-bold tracking-widest">
          {logo !== "" ? (
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${logo}`}
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
          ) : (
            <p>SHOPICO ECOM</p>
          )}
        </Link>

        {/* Cart icon on right */}
        {/* Search icon */}
        <div className="flex items-center space-x-4">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSearchOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            <Search size={20} />
            <span className="sr-only">Search</span>
          </Link>

          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();

              openCart();
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            <ShoppingBag size={20} />
            <span className="sr-only">Cart</span>
          </Link>
        </div>
      </header>
      {/* Add padding to the top of the content when header is sticky to prevent content from being hidden */}
      {/* Add padding to the top of the content when:
          - On home page and sticky
          - On any other page (regardless of sticky state) */}
      <div
        className={`hidden lg:block ${
          (isSticky && isHomePage) || !isHomePage ? "pt-[90px]" : ""
        }`}
      ></div>
      {/* For mobile, we need padding when:
          - On home page and sticky
          - On any other page (regardless of sticky state) */}
      <div
        className={`lg:hidden ${
          (isSticky && isHomePage) || !isHomePage ? "pt-[80px]" : ""
        }`}
      ></div>
      <MobileMenuDrawer
        open={mobileMenuOpen}
        categories={websiteData?.productCategories}
        onClose={() => setMobileMenuOpen(false)}
      />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

interface Category {
  id: number;
  name: string;
  slug: string;
  children: Category[];
}

interface NavItemProps {
  label: string;
  categories?: Category[];
  isSticky?: boolean;
}

function NavItem({ label, categories ,isSticky}: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const showCategoriesDropdown =
    label === "SHOP" && categories && categories.length > 0;

    const handleButtonClick = () => {
      if (showCategoriesDropdown) {
        setIsOpen(!isOpen);
      }
    };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Improved hover handling
  // const handleMouseEnter = () => {
  //   setIsOpen(true);
  // };

  const handleDropdownMouseOver = () => setIsOpen(true);
  const handleDropdownMouseOut = () => setIsOpen(false);

  return (
    <div className="py-4">
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onMouseOver={() => setIsOpen(true)}
        className={`flex items-center cursor-pointer text-[12px] font-semibold ${
          isSticky ? "text-gray-900" : "text-white"
        }`}
      >
        {label}
        {showCategoriesDropdown && (
          <ChevronDown
            size={16}
            className={`ml-1 transition-transform ${
              isOpen ? "rotate-180" : ""
            } ${isSticky ? "text-gray-900" : "text-white"}`}
          />
        )}
      </button>

      {/* Dropdown container */}
      {showCategoriesDropdown && isOpen && (
        <div
          ref={dropdownRef}
          onMouseOver={handleDropdownMouseOver}
          onMouseOut={handleDropdownMouseOut}
          className={`absolute left-0 right-0 top-full z-50 w-screen shadow-lg max-h-[80vh] overflow-y-auto ${
            isSticky ? "bg-white" : "bg-white text-black"
          }`}
        >
          <div className="grid grid-cols-4 gap-6 px-12 py-6">
            {categories.map((category) => (
              <ul key={category.id} className="space-y-2">
                <CategoryItem category={category} isSticky={isSticky} />
              </ul>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function CategoryItem({
  category,
  depth = 0,
  isSticky,
}: {
  category: Category;
  depth?: number;
  isSticky?: boolean;
}) {
  return (
    <li className={`ml-${depth * 4}`}>
      <Link
        href={`/shop/${category.slug}`}
        className={`block ${
          depth === 0
            ? `font-bold ${isSticky ? "text-gray-900" : "text-black"}`
            : depth === 1
            ? `${isSticky ? "text-gray-600" : "text-black"}`
            : `${isSticky ? "text-gray-500" : "text-black"} text-sm`
        } hover:text-black`}
      >
        {category.name}
      </Link>

      {category.children && category.children.length > 0 && (
        <ul className="mt-2 space-y-2">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              depth={depth + 1}
              isSticky={isSticky}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
