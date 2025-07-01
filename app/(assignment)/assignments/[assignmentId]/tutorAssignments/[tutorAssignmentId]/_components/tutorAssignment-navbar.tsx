import { NavbarRoutes } from "@/components/navbar-routes";
import { TutorAssignment } from "@prisma/client";
import { TutorAssignmentMobileSidebar } from "./tutorAssignment-mobile-sidebar";


interface TutorAssignmentNavbarProps {
    tutorAssignment: TutorAssignment[];
    }

export const TutorAssignmentNavbar = ({
    tutorAssignment,
}: TutorAssignmentNavbarProps) => {
    return <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
        <TutorAssignmentMobileSidebar
            tutorAssignment={tutorAssignment}            
        />
        <NavbarRoutes />      
  </div>
};
