"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FacultySidebar } from "./faculty-sidebar";

interface FacultyMobileSidebarProps {
  facultyId?: string;
}

export const FacultyMobileSidebar = ({
  facultyId,
}: FacultyMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu className="h-6 w-6 text-gray-900" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-64">
        <FacultySidebar facultyId={facultyId} />
      </SheetContent>
    </Sheet>
  );
};
