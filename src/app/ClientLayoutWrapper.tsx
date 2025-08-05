"use client";

import { ReactNode } from "react";
import { settings } from "@/lib/redux/features/website/types";
import ClientThemeSetup from "@/components/ClientThemeSetup"; // move this file to components if not already

export default function ClientLayoutWrapper({
  children,
  setting,
}: {
  children: ReactNode;
  setting: settings;
}) {
  return (
    <>
      <ClientThemeSetup setting={setting} />
      {children}
    </>
  );
}
