import SignupPage from "@/Theme/page-components/signup/page";
import { getPageMetadata } from "@/lib/utils/getPageMetadata";

export async function generateMetadata() {
  const meta = await getPageMetadata("Sign Out");

  return {
    title: meta?.title || "Default Title",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
  };
}

const Signup = () => {
    return (<>
  <SignupPage />
  </>
  )
}



export default Signup;