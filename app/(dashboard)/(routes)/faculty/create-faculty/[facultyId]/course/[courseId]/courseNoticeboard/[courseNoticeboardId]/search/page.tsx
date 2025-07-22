import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseNoticeboardSearchInput } from "./_components/courseNoticeboard-search-input";
import { CourseNoticeboardsList } from "./_components/courseNoticeboards-list";
import { Courses } from "./_components/courses";
import { getCourseNoticeboards } from "@/actions/get-courseNoticeboards";


interface CourseNoticeboardSearchPageProps {
  searchParams: Promise<{
    title: string;
    courseId: string;
  }>;
}
const CourseNoticeboardSearchPage = async ({
  searchParams,
}: CourseNoticeboardSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const courses = await db.course.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const courseNoticeboards = await getCourseNoticeboards({
    userId,
    ...await searchParams
  })

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <CourseNoticeboardSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Courses items={courses} />
        <CourseNoticeboardsList items={courseNoticeboards} />
      </div>
    </>
  );
};
export default CourseNoticeboardSearchPage;
