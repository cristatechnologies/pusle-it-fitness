import ProfileForm from "@/Theme/page-components/profile/personal-info/page";

import { CatalogModeGuard } from "../../../../middleware/CatalogModeGuard";

import { getPageMetadata } from "@/lib/utils/getPageMetadata";

export async function generateMetadata() {
  const meta = await getPageMetadata("orders");

  return {
    title: meta?.title || "Default Title",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
  };
}
  
const PersonalInfo = () => {
  return (
    <CatalogModeGuard>
      <ProfileForm />
    </CatalogModeGuard>
  );
};

export default PersonalInfo;
