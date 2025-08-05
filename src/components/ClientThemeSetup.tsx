"use client";

import { useEffect } from "react";
import { settings } from "@/lib/redux/features/website/types";

export default function ClientThemeSetup({ setting }: { setting: settings }) {
  useEffect(() => {
    if (!setting) return;

    // Set favicon
    if (setting.favicon) {
      const setFavicon = (faviconUrl: string) => {
        const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
        existingFavicons.forEach((favicon) => favicon.remove());

        const link = document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = faviconUrl;

        const appleTouchIcon = document.createElement("link");
        appleTouchIcon.rel = "apple-touch-icon";
        appleTouchIcon.href = faviconUrl;

        document.head.appendChild(link);
        document.head.appendChild(appleTouchIcon);
      };

      const faviconUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${setting.favicon}`;
      setFavicon(faviconUrl);
    }

    // Set CSS variables
    const variables = {
      "--primary-color": setting.primary_color,
      "--secondary-color": setting.secondary_color,
      "--primary-text-color": setting.primary_text_color,
      "--secondary-text-color": setting.secondary_text_color,
      "--header-color": setting.header_color,
      "--header-text-color": setting.header_text_color,
      "--topbar-color": setting.topbar_color,
      "--footer-color": setting.footer_color,
      "--footer-text-color": setting.footer_text_color,
      "--hover-color": setting.hover_color,
    };

    Object.entries(variables).forEach(([key, value]) => {
      if (value) {
        document.documentElement.style.setProperty(key, value as string);
      }
    });
  }, [setting]);

  return null;
}
