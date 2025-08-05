"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  children: Category[];
}

interface MobileMenuDrawerProps {
  open: boolean;
  onClose: () => void;
  categories?: Category[];
}

// Add default props to ensure boolean values


export default function MobileMenuDrawer({
  open = false,
  onClose,
  categories = [],
}: MobileMenuDrawerProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
  const [shopExpanded, setShopExpanded] = useState(false);

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const CategoryItem = ({
    category,
    depth = 0,
  }: {
    category: Category;
    depth?: number;
  }) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div className={`${depth > 0 ? "ml-4" : ""}`}>
        <div className="flex items-center justify-between py-2">
          <Link
            href={`/shop/${category.slug}`}
            onClick={onClose}
            className={`flex-1 ${
              depth === 0
                ? " text-gray-900"
                : depth === 1
                ? "text-gray-700"
                : "text-gray-600 text-sm"
            } hover:text-black`}
          >
            {category.name}
          </Link>
          {hasChildren && (
            <button
              onClick={() => toggleCategory(category.id)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2 border-l border-gray-200 pl-2">
            {category.children.map((child) => (
              <CategoryItem key={child.id} category={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:-translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-base font-semibold text-gray-900 pb-5">
                    Menu
                  </DialogTitle>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  <div className="space-y-4">
                    {/* Home */}
                    <div className="py-2">
                      <Link
                        href="/"
                        onClick={onClose}
                        className=" text-gray-900 hover:text-black"
                      >
                        Home
                      </Link>
                    </div>

                    {/* Shop with Categories */}
                    <div className="py-2">
                      <div className="flex items-center justify-between">
                        <Link
                          href="/shop"
                          onClick={onClose}
                          className="flex-1  text-gray-900 hover:text-black"
                        >
                          Shop
                        </Link>
                        {categories && categories.length > 0 && (
                          <button
                            onClick={() => setShopExpanded(!shopExpanded)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            {shopExpanded ? (
                              <ChevronDownIcon className="h-4 w-4" />
                            ) : (
                              <ChevronRightIcon className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                      {shopExpanded && categories && categories.length > 0 && (
                        <div className="mt-3 ml-2 border-l border-gray-200 pl-2 space-y-1">
                          {categories.map((category) => (
                            <CategoryItem
                              key={category.id}
                              category={category}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Blog */}
                    {/* <div className="py-2">
                      <Link
                        href="/blog"
                        onClick={onClose}
                        className=" text-gray-900 hover:text-black"
                      >
                        Blog
                      </Link>
                    </div> */}

                    {/* About Us */}
                    <div className="py-2">
                      <Link
                        href="/about-us"
                        onClick={onClose}
                        className=" text-gray-900 hover:text-black"
                      >
                        About Us
                      </Link>
                    </div>

                    {/* Contacts */}
                    <div className="py-2">
                      <Link
                        href="/contacts"
                        onClick={onClose}
                        className=" text-gray-900 hover:text-black"
                      >
                        Contacts
                      </Link>
                    </div>

                    {/* Additional Links */}
                    <div className="border-t border-gray-200 pt-4 mt-6">
                      <div className="space-y-3">
                        <Link
                          href="/profile/dashboard"
                          onClick={onClose}
                          className="block text-gray-700 hover:text-black"
                        >
                          My Account
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={onClose}
                          className="block text-gray-700 hover:text-black"
                        >
                          Wishlist
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
