
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../shadcn/components/ui/breadcrumb";
import React from "react";

/**
 * Reusable breadcrumb component with centered text
 * @param {Object} props
 * @param {Array} props.items - Array of breadcrumb items
 * @param {string} props.items[].label - Label for the breadcrumb item
 * @param {string} props.items[].href - Path for the breadcrumb item (optional for the last item)
 * @param {string} props.separator - Custom separator (defaults to ">")
 */

// Define the type for a breadcrumb item
interface BreadcrumbItemType {
  label: string;
  href: string;
}

// Define the props for the component
interface BreadcrumbNavProps {
  items: BreadcrumbItemType[];
  separator?: string;
}

export function BreadcrumbNav({
  items = [],
  separator = ">",
}: BreadcrumbNavProps) {
  if (!items || items.length === 0) return null;

  return (
    <Breadcrumb className="py-4 border-y-2 border-[#E3e3e3]">
      <BreadcrumbList className="flex justify-center items-center w-full">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <React.Fragment key={item.label}>
              <BreadcrumbItem>
                {isLastItem ? (
                  <BreadcrumbPage className="uppercase text-[10px] text-gray-600 font-manrope">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    className="uppercase text-[10px] hover:text-gray-900 font-manrope"
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLastItem && (
                <BreadcrumbSeparator className="mx-2 text-gray-400">
                  {separator}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
