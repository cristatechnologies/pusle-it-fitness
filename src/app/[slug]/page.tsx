"use client"

import { useAppSelector } from "@/lib/redux/hook";
import { notFound, usePathname } from "next/navigation";
import Head from "next/head";
import { WebsiteSetupResponse } from "@/lib/redux/features/website/types";// Import your interface
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";

const DynamicPage = () => {


    const pathname = usePathname()

const slug = pathname.slice(1)
    const websiteData = useAppSelector(
    (state) => state.website.data
  ) as WebsiteSetupResponse | null;

  // Explicit type for currentPage
  const currentPage = websiteData?.customPages?.find(
    (page) => page.slug === slug
  );


  if (!websiteData) {
    return <div className="font-manrope p-4">Loading...</div>;
  }

  if (!currentPage) {
    return (
    notFound()
    );
  }
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: `${currentPage.page_name}` , href:`${currentPage.slug}`},
  ];

  return (
    <>
      <Head>
        <title>{currentPage.meta_title || currentPage.page_name}</title>
        <meta name="description" content={currentPage.meta_description} />
        <meta name="keywords" content={currentPage.meta_keyword} />
      </Head>
<BreadcrumbNav items={breadcrumbItems} />
      <div className="font-manrope max-w-4xl mx-auto p-4 md:p-6 min-h-[100vh]">
        <h1 className="text-3xl font-bold mb-6 capitalize">{currentPage.page_name}</h1>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: currentPage.description }}
        />
      </div>
    </>
  );
};

export default DynamicPage;
