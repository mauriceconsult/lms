import { NavbarRoutes } from "@/components/navbar-routes";
import { TutorAssignment, UserProgress } from "@prisma/client"
import { TutorAssignmentMobileSidebar } from "./tutorAssignment-mobile-sidebar";

interface TutorAssignmentNavbarProps {
    assignment: TutorAssignment & {
        tutorAssignments: (TutorAssignment & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progressCount: number;
}

export const TutorAssignmentNavbar = ({
    assignment,
    progressCount,
}: TutorAssignmentNavbarProps) => {
   return <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
       <TutorAssignmentMobileSidebar
           assignment={assignment}
           progressCount={progressCount}
       /> 
       <NavbarRoutes />      
  </div>
};