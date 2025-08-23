import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  getDashboardCourses,
  // CourseWithProgressWithAdmin
} from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/app/(eduplat)/_components/courses-list";
import { CheckCircle, Clock } from "lucide-react";
import { EduplatNavbar } from "@/app/(eduplat)/_components/eduplat-navbar";
import { EduplatSidebar } from "@/app/(eduplat)/_components/eduplat-sidebar";
import { CourseWithProgressWithAdmin } from "@/app/(eduplat)/types/course";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    console.log(`[${new Date().toISOString()} DashboardPage] No userId, redirecting to /`);
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);
  const courses: CourseWithProgressWithAdmin[] = [...coursesInProgress, ...completedCourses];

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
          {coursesInProgress.length === 0 && completedCourses.length === 0 ? (
            <p className="text-sm text-gray-500">No courses available</p>
          ) : (
            <>
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
