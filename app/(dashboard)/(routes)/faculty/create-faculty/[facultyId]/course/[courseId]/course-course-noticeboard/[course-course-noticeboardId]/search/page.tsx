import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Courses } from "../../../../../../../../admin/create-admin/[adminId]/course/[courseId]/search/_components/courses";
import { getCourseNoticeboards } from "@/actions/get-courseNoticeboards";
import { CourseNoticeboardSearchInput } from "./_components/course-course-noticeboard-search-input";
import { CourseNoticeboardsList } from "./_components/course-course-noticeboard-list";

interface CourseNoticeboardIdSearchPageProps {
  searchParams: Promise<{
    title: string;
    courseCourseNoticeboardId: string;
    courseId: string;
    facultyId: string;
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
