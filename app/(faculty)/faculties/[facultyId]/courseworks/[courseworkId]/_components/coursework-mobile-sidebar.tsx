import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Coursework } from "@prisma/client";
import { Menu } from "lucide-react";
import CourseworkSidebar from "./coursework-sidebar";

interface CourseworkNavbarProps {
  coursework: Coursework & {
    courseworks: Coursework[];
  };
}
export const CourseworkMobileSidebar = ({ coursework }: CourseworkNavbarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white w-72">
        <CourseworkSidebar coursework={coursework} />
      </SheetContent>
    </Sheet>
  );
};
