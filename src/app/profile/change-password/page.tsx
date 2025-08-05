import ChangePasswordPage from "@/Theme/page-components/profile/change-password/page";
import { withCatalogModeGuard } from "../../../../middleware/CatalogModeGuard";


import { getPageMetadata } from "@/lib/utils/getPageMetadata";

export async function generateMetadata() {
  const meta = await getPageMetadata("change-password");

  return {
    title: meta?.title || "Default Title",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
  };
}


const changePassword = () => {


    return (
        <>
        <ChangePasswordPage />
        </>
    )
}
export default withCatalogModeGuard(changePassword);