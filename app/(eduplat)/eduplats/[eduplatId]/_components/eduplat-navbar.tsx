import { EduplatNavbarRoutes } from "@/app/(eduplat)/_components/eduplat-navbar-routes";
import { EduplatMobileSidebar } from "./eduplat-mobile-sidebar";


export const EduplatNavbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <EduplatMobileSidebar />
      <EduplatNavbarRoutes />
    </div>
  );
};
