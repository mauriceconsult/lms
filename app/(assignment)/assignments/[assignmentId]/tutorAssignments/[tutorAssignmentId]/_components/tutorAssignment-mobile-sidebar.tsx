import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TutorAssignment } from "@prisma/client";
import { Menu } from "lucide-react";
import TutorAssignmentSidebar from "./tutorAssignment-sidebar";

interface TutorAssignmentMobileSidebarProps {
  tutorAssignment: TutorAssignment[];
}

export const TutorAssignmentMobileSidebar = ({
  tutorAssignment,
}: TutorAssignmentMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white w-72">
        <TutorAssignmentSidebar tutorAssignment={tutorAssignment} />
      </SheetContent>
    </Sheet>
  );
};
