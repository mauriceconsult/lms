import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourses } from "@/actions/get-courses";
import { CourseSearchInput } from "./_components/course-search-input";
import { CoursesList } from "./_components/courses-list";

interface CourseSearchPageProps {
  searchParams: Promise<{
    title: string;
    adminId: string;
    courseId: string;
  }>;
}
const CourseSearchPage = async ({ searchParams }: CourseSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const admins = await db.admin.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const courses = await getCourses({
    userId,
    ...(await searchParams),
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <CourseSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Admins items={admins} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};
export default CourseSearchPage;
