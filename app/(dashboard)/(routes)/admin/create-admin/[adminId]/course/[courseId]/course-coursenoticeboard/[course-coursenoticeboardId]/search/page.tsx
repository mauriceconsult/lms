import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Courses } from "../../../search/_components/courses";
import { getCourseNoticeboards } from "@/actions/get-courseNoticeboards";
import { CourseNoticeboardSearchInput } from "./_components/course-coursenoticeboard-search-input";
import { CourseNoticeboardsList } from "./_components/course-coursenoticeboard-list";


interface CourseNoticeboardIdSearchPageProps {
  searchParams: Promise<{
    title: string;
    courseCourseNoticeboardId: string;
    courseId: string;
    adminId: string;
  }>;
}
const CourseNoticeboardSearchPage = async ({
  searchParams,
}: CourseNoticeboardIdSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const courses = await db.course.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const courseCourseNoticeboards = await getCourseNoticeboards({
    userId,
    ...(await searchParams),
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <CourseNoticeboardSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Courses items={courses} />
        <CourseNoticeboardsList items={courseCourseNoticeboards} />
      </div>
    </>
  );
};
export default CourseNoticeboardSearchPage;
