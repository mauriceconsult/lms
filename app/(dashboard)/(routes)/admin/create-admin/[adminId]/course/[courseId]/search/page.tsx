import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseSearchInput } from "./_components/course-search-input";
import { Admins } from "../../../search/_components/admins";
import { getAdmins } from "@/actions/get-admins";
import CoursesList from "./_components/courses-list";

interface CourseSearchPageProps {
  searchParams: Promise<{
    title: string;
    courseId: string;
    adminId: string;
  }>
}

const CourseSearchPage = async ({
  searchParams
}: CourseSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/"); 
  }
  const courses = await db.course.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const admins = await getAdmins({
    userId,
    ...await searchParams
  }) 
  return (
    <>
      <div className="px-6 pt-4 md:hidden md:mb-0 block">
        <CourseSearchInput />
      </div>
      <div className="p-6">
        <Admins items={admins} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default CourseSearchPage;
