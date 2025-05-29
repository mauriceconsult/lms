import { db } from "@/lib/db";
import { Schools } from "./_components/schools";
// import { getCourses } from "@/actions/get-faculties";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FacultySearchInput } from "./_components/faculty-search-input";
// import { CoursesList } from "@/components/courses-list";

interface FacultySearchPageProps {
  searchParams: {
    title: string;
    schoolId: string;
  };
}
const FacultySearchPage = async ({}: // searchParams
FacultySearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const schools = await db.school.findMany({
    orderBy: {
      name: "asc",
    },
  });
  // const courses = await getCourses({
  //   userId,
  //   ...searchParams
  // })

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <FacultySearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Schools items={schools} />
        {/* <CoursesList items={courses} /> */}
      </div>
    </>
  );
};
export default FacultySearchPage;
