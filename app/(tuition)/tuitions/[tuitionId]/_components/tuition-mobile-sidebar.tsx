import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import TuitionSidebar from "./tuition-sidebar";
import { Tuition } from "@prisma/client";

interface TuitionMobileSidebarProps {
    tuition: Tuition[];
    }
export const TuitionMobileSidebar = ({
    tuition,
}: TuitionMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white w-72">
        <TuitionSidebar tuition={tuition} />
      </SheetContent>
    </Sheet>
  );
};
