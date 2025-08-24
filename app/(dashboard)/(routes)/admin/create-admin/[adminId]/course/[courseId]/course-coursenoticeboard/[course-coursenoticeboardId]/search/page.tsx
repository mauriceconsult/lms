import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseCourseNoticeboardSearchInput } from "./_components/course-coursenoticeboard-search-input";
import { CourseCourseNoticeboardsList } from "./_components/course-coursenoticeboard-list";
// import { CoursesList } from "./_components/courses-list";
import { getCourseNoticeboards } from "@/actions/get-courseNoticeboards";
import CoursesList from "./_components/courses-list";

interface CourseNoticeboardIdSearchPageProps {
  searchParams: Promise<{
    title: string;
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
  const courseNoticeboards = await getCourseNoticeboards({
    userId, // Ensure GetCourseNoticeboardsParams includes userId
    ...(await searchParams),
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <CourseCourseNoticeboardSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <CoursesList items={courses} />
        <CourseCourseNoticeboardsList items={courseNoticeboards} />
      </div>
    </>
  );
};

export default CourseNoticeboardSearchPage;
