import AddressPage from "@/Theme/page-components/profile/my-address/page"
import { CatalogModeGuard } from "../../../../middleware/CatalogModeGuard";
import { getPageMetadata } from "@/lib/utils/getPageMetadata";

export async function generateMetadata() {
  const meta = await getPageMetadata("address");

  return {
    title: meta?.title || "Default Title",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
  };
}

const MyAddress = () =>{
    return (<>
    <CatalogModeGuard>

    <AddressPage />
    </CatalogModeGuard>

    
    </>)
}


export default MyAddress;