import { db } from "@/lib/db";
import { Faculties } from "./_components/faculties";
import { CourseSearchInput } from "./_components/course-search-input";
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
  const faculties = await db.faculty.findMany({
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
        <Faculties items={faculties} />
        {/* <CoursesList items={courses} /> */}
      </div>
    </>
  );
};
export default CourseSearchPage;
