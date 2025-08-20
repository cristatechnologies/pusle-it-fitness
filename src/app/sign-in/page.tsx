import SigninPage from "@/Theme/page-components/signin/page";
import { CatalogModeGuard } from "../../../middleware/CatalogModeGuard";
import { getPageMetadata } from "@/lib/utils/getPageMetadata";

export async function generateMetadata() {
  const meta = await getPageMetadata("Sign In");

  return {
    title: meta?.title || "Default Title",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
  };
}

const Signin = () => {
  return (
    <>
      <CatalogModeGuard>
        <SigninPage />
      </CatalogModeGuard>
    </>
  );
};

export default Signin;
