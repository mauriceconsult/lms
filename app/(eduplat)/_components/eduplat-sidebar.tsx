"use client";

import { CourseWithProgressWithAdmin } from "../types/course";
// import { CourseWithProgressWithAdmin } from "@/types/course";
import { EduplatSidebarRoutes } from "./eduplat-sidebar-routes";

interface EduplatSidebarProps {
  courses: CourseWithProgressWithAdmin[];
}

export const EduplatSidebar = ({ courses }: EduplatSidebarProps) => {
  if (!courses) {
    console.log(`[${new Date().toISOString()} EduplatSidebar] Loading courses...`);
    return <div className="p-6 text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold">EduPlat Dashboard</h2>
      </div>
      {courses.length === 0 ? (
        <div className="px-6 text-sm text-gray-500">No courses available</div>
      ) : (
        <EduplatSidebarRoutes courses={courses} />
      )}
    </div>
  );
};
