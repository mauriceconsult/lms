import { CourseMobileSidebar } from "@/app/(course)/_components/course-mobile-sidebar";
import { CourseNavbarRoutes } from "@/app/(course)/_components/course-navbar-routes";
import { CourseSidebar } from "@/app/(course)/_components/course-sidebar";

export default async function CourseIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ facultyId: string; courseId: string }>;
}) {
  const { courseId } = await params;

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbarRoutes courseId={courseId} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar courseId={courseId} />
      </div>
      <div className="md:hidden h-[80px] fixed inset-y-0 w-full z-50">
        <CourseMobileSidebar courseId={courseId} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
}
