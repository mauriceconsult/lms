import { NavbarRoutes } from "@/components/navbar-routes";
import { Coursework } from "@prisma/client";
import { CourseworkMobileSidebar } from "./coursework-mobile-sidebar";

interface CourseworkNavbarProps {
    coursework: Coursework[];
    }

export const CourseworkNavbar = ({
    coursework,
}: CourseworkNavbarProps) => {
    return <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
        <CourseworkMobileSidebar
            coursework={coursework}            
        />
        <NavbarRoutes />      
  </div>
};
