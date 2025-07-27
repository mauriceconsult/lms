"use client";
import { Logo } from "@/app/(dashboard)/_components/logo";
import { FacultySidebarRoutes } from "./faculty-sidebar-routes";

interface FacultySidebarProps {
  facultyId?: string; // Match FacultySidebarRoutes and FacultyNavbarRoutes
}

export const FacultySidebar = ({ facultyId }: FacultySidebarProps) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <Logo />
      </div>

      <div className="h-full border-r bg-white shadow-sm w-64 p-4">
        <FacultySidebarRoutes facultyId={facultyId} />
      </div>
    </div>
  );
};
