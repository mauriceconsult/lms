import { NavbarRoutes } from "@/components/navbar-routes";
import { Tuition } from "@prisma/client";
import { TuitionMobileSidebar } from "./tuition-mobile-sidebar";

interface TuitionNavbarProps {
    tuition: Tuition[];
    }

export const TuitionNavbar = ({
    tuition,
}: TuitionNavbarProps) => {
    return <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
        <TuitionMobileSidebar
            tuition={tuition}            
        />
        <NavbarRoutes />      
  </div>
};
