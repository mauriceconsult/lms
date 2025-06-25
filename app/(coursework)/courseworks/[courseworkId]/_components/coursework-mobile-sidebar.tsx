import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import CourseworkSidebar from "./coursework-sidebar";
import { Coursework } from "@prisma/client";

interface CourseworkNavbarProps {
    coursework: Coursework[];
    }
export const CourseworkMobileSidebar = ({
    coursework,
}: CourseworkNavbarProps) => {
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
