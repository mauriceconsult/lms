import { db } from "@/lib/db";
import { Courses } from "./_components/courses";
import { CourseSearchInput } from "../../../search/_components/course-search-input";
// import { SearchInput } from "@/app/(dashboard)/(routes)/search/_components/faculty-search-input";
// import { getCourses } from "@/actions/get-faculties";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { CoursesList } from "@/components/courses-list";

interface CourseSearchPageProps {
  searchParams: {
    title: string;
    facultyId: string;
  };
}
const CourseSearchPage = async ({}: // searchParams
CourseSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const courses = await db.course.findMany({
    orderBy: {
      title: "asc",
    },
  });
  // const courses = await getCourses({
  //   userId,
  //   ...searchParams
  // })

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <CourseSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Courses items={courses} />
        {/* <CoursesList items={courses} /> */}
      </div>
    </>
  );
};
export default CourseSearchPage;
