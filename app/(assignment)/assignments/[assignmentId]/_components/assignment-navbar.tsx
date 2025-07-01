import { NavbarRoutes } from "@/components/navbar-routes";
import { Assignment, TutorAssignment, UserProgress } from "@prisma/client"
import { AssignmentMobileSidebar } from "./assignment-mobile-sidebar";

interface AssignmentNavbarProps {
    assignment: Assignment & {
        tutorAssignments: (TutorAssignment & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progressCount: number;
}

export const AssignmentNavbar = ({
    assignment,
    progressCount,
}: AssignmentNavbarProps) => {
   return <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
       <AssignmentMobileSidebar
           assignment={assignment}
           progressCount={progressCount}
       /> 
       <NavbarRoutes />      
  </div>
};