import HomePage from "../Theme/page-components/Home/page";
import { getPageMetadata } from "@/lib/utils/getPageMetadata";

export async function generateMetadata() {
  const meta = await getPageMetadata("home");

  return {
    title: meta?.title || "Default Title",
    description: meta?.description || "Default Description",
    keywords: meta?.keyword || "",
    robots: "index,follow", // Add robots here instead of in Head
  };
}

export default function Home() {
  return <HomePage />;
}
