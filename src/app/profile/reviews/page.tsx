import ReviewsPage from "@/Theme/page-components/profile/reviews/page";
import { CatalogModeGuard } from "../../../../middleware/CatalogModeGuard";
import { getPageMetadata } from "@/lib/utils/getPageMetadata";

export async function generateMetadata() {
  const meta = await getPageMetadata("reviews");

  return {
    title: meta?.title || "Default Title",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
  };
}


const reviews = () => {
  return (
    <>
      <CatalogModeGuard>
        <ReviewsPage />
      </CatalogModeGuard>
    </>
  );
};

export default reviews;
