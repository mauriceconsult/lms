"use client";

import { FacultySidebarRoutes } from "./faculty-sidebar-routes";

interface FacultySidebarProps {
  facultyId?: string; // Match FacultySidebarRoutes and FacultyNavbarRoutes
}

export const FacultySidebar = ({ facultyId }: FacultySidebarProps) => {
  return (
    <div className="h-full border-r bg-white shadow-sm w-64 p-4">
      <FacultySidebarRoutes facultyId={facultyId} />
    </div>
  );
};
