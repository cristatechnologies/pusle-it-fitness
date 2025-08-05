// app/layout.tsx

import "../Theme/globals.css";
import { ReduxProvider } from "./providers";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/Theme/ThemeProvider";
import { CartProvider } from "@/context/Cart-Context";
import MaintenancePage from "@/app/maintenance/page";
import ClientLayoutWrapper from "./ClientLayoutWrapper";
import Script from "next/script";
import ClientThemeSetup from "@/components/ClientThemeSetup";

async function getWebsiteSetup() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/website-setup`
  );
  return res.json();
}

async function getHomepageData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api`);
  return res.json();
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteData = await getWebsiteSetup();
  const homepageData = await getHomepageData();
  const isMaintenance = websiteData?.maintainance?.status === 1;

  return (
    <html lang="en">
      <body>
        {/* Google Tag Manager script */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TR643D4V');
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DPXEH9YZCS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-DPXEH9YZCS');
    `}
        </Script>

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TR643D4V"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <ClientThemeSetup setting={websiteData?.setting} />
        <ReduxProvider
          initialWebsiteData={websiteData}
          initialHomepageData={homepageData}
        >
          <ClientLayoutWrapper setting={websiteData?.setting}>
            {isMaintenance ? (
              <MaintenancePage />
            ) : (
              <>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    success: {
                      style: {
                        background: "#fff",
                        color: "#1f2937",
                        border: "1px solid #d1d5db",
                        padding: "16px",
                      },
                      iconTheme: {
                        primary: "#10b981",
                        secondary: "#ecfdf5",
                      },
                    },
                    error: {
                      style: {
                        background: "#fff",
                        color: "#1f2937",
                        border: "1px solid #fca5a5",
                        padding: "16px",
                      },
                      iconTheme: {
                        primary: "#ef4444",
                        secondary: "#fee2e2",
                      },
                    },
                    style: {
                      borderRadius: "6px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                      fontSize: "14px",
                    },
                  }}
                />

                <CartProvider>
                  <ThemeProvider>{children}</ThemeProvider>
                </CartProvider>
              </>
            )}
          </ClientLayoutWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
