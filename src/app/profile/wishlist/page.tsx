import ProfileWishlistPage from "@/Theme/page-components/profile/wishlist/page";
import { getPageMetadata } from "@/lib/utils/getPageMetadata";

export async function generateMetadata() {
  const meta = await getPageMetadata("wishlist");

  return {
    title: meta?.title || "Default Title",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
  };
}



const wishlist = () => {
    return (<>
    <ProfileWishlistPage/>
    </>)
}
export default wishlist;