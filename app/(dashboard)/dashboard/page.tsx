import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CoursesList } from "../(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/search/_components/courses-list";
// import { CoursesList } from "@/faculty/create-faculty/[facultyId]/course/[courseId]/search/_components/courses-list";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>{/* TODO: Info card for completed courses */}</div>
        <div>{/* TODO: Info card for courses in progress */}</div>
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}