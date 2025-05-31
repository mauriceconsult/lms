import { db } from "@/lib/db";
import { CourseSearchInput } from "./_components/course-search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CoursesList } from "./_components/courses-list";
import { getCourses } from "@/actions/get-courses";
import { Courses } from "./_components/courses";


interface CourseSearchPageProps {
  courseSearchParams: {
    title: string;
    facultyId: string;
  };
}
const CourseSearchPage = async ({
  courseSearchParams
}: CourseSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const faculties = await db.faculty.findMany({
    orderBy: {
      title: "asc"
    }
  })
  const courses = await getCourses({
    userId,
    ...courseSearchParams
  })
  
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <CourseSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Courses
          items={faculties.map(faculty => ({
            ...faculty,
            docId: null,
            facultyId: faculty.id,
            amount: null
          }))}
        />
        <CoursesList items={courses} />
      </div>
    </>
  );
};
export default CourseSearchPage;
