import { NavbarRoutes } from "@/components/navbar-routes";
import { Course, Noticeboard } from "@prisma/client";
import { NoticeboardMobileSidebar } from "./noticeboard-mobile-sidebar";

interface NoticeboardNavbarProps {
    noticeBoard: Noticeboard & {
        courses: (Course)[];
    }
}

export const NoticeboardNavbar = ({
    noticeBoard,
}: NoticeboardNavbarProps) => {
    return <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
        <NoticeboardMobileSidebar
            noticeBoard={noticeBoard}
            
        />
        <NavbarRoutes />      
  </div>
};
