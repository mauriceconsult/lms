import { redirect } from "next/navigation";
import { CourseMobileSidebar } from "./_components/course-mobile-sidebar";
import { CourseNavbarRoutes } from "./_components/course-navbar-routes";
import { CourseSidebar } from "./_components/course-sidebar";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId?: string }>;
}) {
  console.log(`[${new Date().toISOString()} CourseLayout] Raw params:`, {
    params,
  });

  const resolvedParams = await params;
  console.log(`[${new Date().toISOString()} CourseLayout] Resolved params:`, {
    resolvedParams,
  });

  const courseId = resolvedParams?.courseId;

  console.log(
    `[${new Date().toISOString()} CourseLayout] Extracted courseId:`,
    { courseId }
  );

  if (!courseId) {
    console.error(
      `[${new Date().toISOString()} CourseLayout] Invalid courseId:`,
      { resolvedParams }
    );
    return redirect("/faculties");
  }

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
