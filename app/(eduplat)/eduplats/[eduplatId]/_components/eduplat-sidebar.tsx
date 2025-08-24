// import { EduplatLogo } from "./eduplat-logo";
import { EduplatSidebarRoutes } from "./eduplat-sidebar-routes";

import EduplatLogo from "@/app/(eduplat)/_components/eduplat-logo";

export const EduplatSidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <EduplatLogo />
      </div>
      <div className="flex flex-col w-full">
        <EduplatSidebarRoutes />
      </div>
    </div>
  );
};
