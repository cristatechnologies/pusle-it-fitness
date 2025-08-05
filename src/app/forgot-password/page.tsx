// src/app/forgot-password/page.tsx
import ForgotPasswordForm from "@/Theme/page-components/forgot-password/page";
import { BreadcrumbNav } from "@/Theme/Helpers/Breadcrumb";
import { withCatalogModeGuard } from "../../../middleware/CatalogModeGuard";
import { getPageMetadata } from "@/lib/utils/getPageMetadata";
// Static metadata
export async function generateMetadata() {
  const meta = await getPageMetadata("forgot-password");

  return {
    title: meta?.title || "Default Title",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
  };
}

const ForgotPasswordPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Forgot Password", href: "/forgot-password" },
  ];

  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="max-w-lg w-full mx-auto py-12 px-4">
        <ForgotPasswordForm />
      </div>
    </>
  );
};

export default withCatalogModeGuard(ForgotPasswordPage);
