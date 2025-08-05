// app/contact-us/page.tsx (no "use client")
import dynamic from "next/dynamic";
import { getPageMetadata } from "@/lib/utils/getPageMetadata";

// Dynamically import client component — but keep SSR enabled
const ContactUsComponent = dynamic(
  () => import("@/Theme/page-components/contact-us/page"),
  { ssr: true } // ✅ Keep SSR true so metadata works
);

export async function generateMetadata() {
  const meta = await getPageMetadata("contact-us");

  return {
    title: meta?.title || "Contact us",
    description: meta?.description || "Contact us",
    keywords: meta?.keyword || "Contact us",
  };
}

const ContactUsPage = () => {
  return (
    <main>
      <ContactUsComponent />
    </main>
  );
};

export default ContactUsPage;
