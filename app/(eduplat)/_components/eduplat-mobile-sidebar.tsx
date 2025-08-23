import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { EduplatSidebar } from "./eduplat-sidebar";
import { CourseWithProgressWithFaculty } from "@/types/course";


interface EduplatMobileSidebarProps {
  courses: CourseWithProgressWithFaculty[];
}

export const EduplatMobileSidebar = ({ courses }: EduplatMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu className="w-6 h-6" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-64">
        <EduplatSidebar courses={courses} />
      </SheetContent>
    </Sheet>
  );
};
