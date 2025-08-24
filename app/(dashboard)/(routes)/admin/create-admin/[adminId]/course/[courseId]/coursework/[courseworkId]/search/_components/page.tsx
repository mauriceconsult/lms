import { db } from "@/lib/db";
// import { CourseworkSearchInput } from "./_components/coursework-search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { Courses } from "../../../../../../../../admin/create-admin/[adminId]/course/[courseId]/search/_components/courses";
// import { CourseworksList } from "./_components/courseworks-list";
import { getCourseworks } from "@/actions/get-courseworks";
import { CourseworkSearchInput } from "./coursework-search-input";
import { CourseworksList } from "./courseworks-list";
import { Courses } from "../../../../search/_components/courses";

interface CourseworkIdSearchPageProps {
  searchParams: Promise<{
    title: string;
    courseworkId: string;
    courseId: string;
    adminId: string;
  }>;
}
const CourseworkSearchPage = async ({
  searchParams,
}: CourseworkIdSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const courses = await db.course.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const courseworks = await getCourseworks({
    userId,
    ...(await searchParams),
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <CourseworkSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Courses items={courses} />
        <CourseworksList items={courseworks} />
      </div>
    </>
  );
};
export default CourseworkSearchPage;
