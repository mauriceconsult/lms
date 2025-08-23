import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getDashboardCourses,
  // CourseWithProgressWithFaculty
} from "@/actions/get-dashboard-courses";
import EduplatNavbar from "./_components/eduplat-navbar";
import { EduplatSidebar } from "./_components/eduplat-sidebar";
import { CourseWithProgressWithFaculty } from "@/types/course";

const EduplatLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();
  if (!userId) {
    console.log(`[${new Date().toISOString()} EduplatLayout] No userId, redirecting to /`);
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);
  const courses: CourseWithProgressWithFaculty[] = [...coursesInProgress, ...completedCourses];

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <EduplatNavbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <EduplatSidebar courses={courses} />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default EduplatLayout;
