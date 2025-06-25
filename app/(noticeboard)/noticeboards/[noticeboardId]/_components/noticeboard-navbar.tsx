import { NavbarRoutes } from "@/components/navbar-routes";
import { Noticeboard } from "@prisma/client";
import { NoticeboardMobileSidebar } from "./noticeboard-mobile-sidebar";

interface NoticeboardNavbarProps {
    noticeboard: Noticeboard[];
    }

export const NoticeboardNavbar = ({
    noticeboard,
}: NoticeboardNavbarProps) => {
    return <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
        <NoticeboardMobileSidebar
            noticeboard={noticeboard}            
        />
        <NavbarRoutes />      
  </div>
};
