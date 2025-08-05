// features/catalog-mode/CatalogModeGuard.server.tsx
import { getWebsiteData } from "@/lib/redux/store";
import { notFound } from "next/navigation";

interface CatalogModeGuardProps {
  children: React.ReactNode;
}

export async function CatalogModeGuard({ children }: CatalogModeGuardProps) {
  const websiteData = await getWebsiteData();

  if (websiteData?.catalog_mode?.status === 1) {
    return notFound(); // Returns 404 page
  }

  return <>{children}</>;
}


export function withCatalogModeGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return async function ComponentWithCatalogModeGuard(props: P) {
    const websiteData = await getWebsiteData();

    if (websiteData?.catalog_mode?.status === 1) {
      return notFound();
    }

    return <WrappedComponent {...props} />;
  };
}
