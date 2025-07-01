import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Assignment, TutorAssignment, UserProgress } from "@prisma/client"
import { Menu } from "lucide-react";
import AssignmentSidebar from "./assignment-sidebar";

interface AssignmentMobileSidebarProps {
    assignment: Assignment & {
        tutorAssignments: (TutorAssignment & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progressCount: number;
}
export const AssignmentMobileSidebar = ({
    assignment,
    progressCount,
}: AssignmentMobileSidebarProps) => {
    return ( 
    <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
            <Menu/>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0 bg-white w-72">
            <AssignmentSidebar assignment={assignment} progressCount={progressCount}/>
        </SheetContent>
   </Sheet>
    )
}