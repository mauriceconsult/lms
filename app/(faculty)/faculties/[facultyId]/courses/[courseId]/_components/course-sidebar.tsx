"use client";
import { Logo } from "@/app/(dashboard)/_components/logo";
import { CourseSidebarRoutes } from "./course-sidebar-routes";

interface CourseSidebarProps {
  courseId?: string; // Match CourseSidebarRoutes and CourseNavbarRoutes
}

export const CourseSidebar = ({ courseId }: CourseSidebarProps) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <Logo />
      </div>

      <div className="h-full border-r bg-white shadow-sm w-64 p-4">
        <CourseSidebarRoutes courseId={courseId} />
      </div>
    </div>
  );
};
