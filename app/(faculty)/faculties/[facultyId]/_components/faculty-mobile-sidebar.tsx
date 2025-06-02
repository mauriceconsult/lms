import { Menu } from "lucide-react";
import { Faculty, Course } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FacultySidebar } from "./faculty-sidebar";

interface FacultyMobileSidebarProps {
  faculty: Faculty & {
    courses: Course[];
  };
}
export const FacultyMobileSidebar = ({
    faculty
}: FacultyMobileSidebarProps) => {
    return (
      <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
          <Menu />
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0 bg-white w-72">
          <FacultySidebar faculty={faculty} />
        </SheetContent>
      </Sheet>
    );
}