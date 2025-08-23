import EduPlatLogo from "./eduplat-logo";
import { EduplatSidebarRoutes } from "./eduplat-sidebar-routes";
import { CourseWithProgressWithFaculty } from "@/types/course";

interface EduplatSidebarProps {
  courses: CourseWithProgressWithFaculty[];
}

export const EduplatSidebar = ({ courses }: EduplatSidebarProps) => {
  return (
    <div className="flex flex-col h-full border-r bg-white shadow-sm">
      <div className="p-6">
        <EduPlatLogo />
      </div>
      <div className="flex flex-col w-full">
        <EduplatSidebarRoutes courses={courses} />
      </div>
    </div>
  );
};
