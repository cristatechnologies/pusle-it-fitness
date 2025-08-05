import DashboardPage from "@/Theme/page-components/profile/dashboard/page";
import { CatalogModeGuard } from "../../../../middleware/CatalogModeGuard";

const dashboard = () => {
  return (
    <CatalogModeGuard>
      <DashboardPage />
    </CatalogModeGuard>
  );
};

export default dashboard;
