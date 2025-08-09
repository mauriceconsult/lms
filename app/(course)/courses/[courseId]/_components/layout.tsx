import { ReactNode } from "react";
import { CourseSidebar } from "./course-sidebar";
import { CourseMobileSidebar } from "./course-mobile-sidebar";
import { CourseNavbarRoutes } from "./course-navbar-routes";

interface CourseLayoutProps {
  children: ReactNode;
  params: Promise<{ facultyId: string; courseId: string }>;
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const { courseId } = await params;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="h-[80px] fixed inset-y-0 w-full z-50 bg-white shadow-sm">
        <CourseNavbarRoutes courseId={courseId} />
      </div>
      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <CourseMobileSidebar courseId={courseId} />
      </div>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50 bg-white shadow-sm">
        <CourseSidebar courseId={courseId} />
      </div>
      {/* Main Content */}
      <div className="flex-1 md:pl-56 pt-[80px]">
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
