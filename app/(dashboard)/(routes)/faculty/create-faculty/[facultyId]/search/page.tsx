import { db } from "@/lib/db";
import { Faculties } from "./_components/faculties";
import { FacultySearchInput } from "./_components/faculty-search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "./_components/courses-list";


interface SearchPageProps {
  searchParams: {
    title: string;
    schoolId: string;
  };
}
const FacultySearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const faculties = await db.faculty.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <FacultySearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Faculties items={faculties} />
        <CoursesList item={courses} />
      </div>
    </>
  );
};
export default FacultySearchPage;
