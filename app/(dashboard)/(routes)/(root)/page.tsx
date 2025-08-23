import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
// import { getDashboardCourses, CourseWithProgressWithFaculty } from "@/types/course";
// import { CoursesList } from "@/app/(eduplat)/_components/courses-list"; // Adjust path if needed
// import { EduplatNavbar } from "@/app/(eduplat)/_components/eduplat-navbar";
import { CheckCircle, Clock } from "lucide-react";
import { EduplatSidebar } from "@/app/(eduplat)/_components/eduplat-sidebar";
import { CourseWithProgressWithFaculty } from "@/app/(eduplat)/types/course";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import EduplatNavbar from "@/app/(eduplat)/_components/eduplat-navbar";
import { CoursesList } from "../../_components/courses-list";

export default async function DashboardPage() {
  const { userId } = await auth(); // Await server-side auth
  if (!userId) {
    console.log(`[${new Date().toISOString()} DashboardPage] No userId, redirecting to /`);
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId); // Await promise
  const courses: CourseWithProgressWithFaculty[] = [...coursesInProgress, ...completedCourses];

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <EduplatNavbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <EduplatSidebar courses={courses} />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">My Courses</h1>
          {coursesInProgress.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <Clock className="w-5 h-5 mr-2" />
                In Progress
              </h2>
              <CoursesList courses={coursesInProgress} />
            </div>
          )}
          {completedCourses.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <CheckCircle className="w-5 h-5 mr-2" />
                Completed
              </h2>
              <CoursesList courses={completedCourses} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
