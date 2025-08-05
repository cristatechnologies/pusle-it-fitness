

import WishlistPage from "@/Theme/page-components/wishlist-page/page";

import { getPageMetadata } from "@/lib/utils/getPageMetadata";

export async function generateMetadata() {
  const meta = await getPageMetadata("wishlist");

  return {
    title: meta?.title || "Default Title",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
  };
}






const wishlist = () =>{
    
    return (<>
    <WishlistPage />
    </>)
}

export default wishlist