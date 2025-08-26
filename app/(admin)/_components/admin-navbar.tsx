import { NavbarRoutes } from "@/components/navbar-routes";
import { AdminMobileSidebar } from "./admin-mobile-sidebar";

export const AdminNavbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
          <AdminMobileSidebar />
          <NavbarRoutes/>
    </div>
  );
};
