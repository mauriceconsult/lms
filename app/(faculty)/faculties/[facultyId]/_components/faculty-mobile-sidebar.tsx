import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Course, Faculty } from "@prisma/client";
import { Menu } from "lucide-react";
import FacultySidebar from "./faculty-sidebar";

interface FacultyNavbarProps {
    faculty: Faculty & {
        courses: (Course)[];
    }
}
export const FacultyMobileSidebar = ({
    faculty,
}: FacultyNavbarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white w-72">
        <FacultySidebar faculty={faculty} />
      </SheetContent>
    </Sheet>
  )
};
