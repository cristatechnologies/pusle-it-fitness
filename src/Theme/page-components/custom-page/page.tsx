"use client";
import { notFound } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hook";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import { WebsiteSetupResponse } from "@/lib/redux/features/website/types";

export default function DynamicPageClient({ slug }: { slug: string }) {
  const websiteData = useAppSelector(
    (state) => state.website.data
  ) as WebsiteSetupResponse | null;

  const currentPage = websiteData?.customPages?.find(
    (page) => page.slug === slug
  );

  if (!websiteData) {
    return <div className="font-manrope p-4">Loading...</div>;
  }

  if (!currentPage) {
    return notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: currentPage.page_name || "", href: `/${currentPage.slug}` },
  ];

  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="font-manrope max-w-4xl mx-auto p-4 md:p-6 min-h-[100vh]">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {currentPage.page_name}
        </h1>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: currentPage.description || "" }}
        />
      </div>
    </>
  );
}
