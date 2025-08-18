import { db } from "@/lib/db";
import { TutorSearchInput } from "./_components/tutor-search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TutorsList } from "./_components/tutors-list";
import { getTutors } from "@/actions/get-tutors";
import { Courses } from "../../../search/_components/courses";


interface TutorSearchPageProps {
  searchParams: Promise<{
    title: string;
    facultyId: string;
    courseId: string;
    tutorId: string;
  }>;
}
const TutorSearchPage = async ({
  searchParams
}: TutorSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const courses = await db.course.findMany({
    orderBy: {
      title: "asc"
    }
  })
  const tutors = await getTutors({
    userId,
    ...(await searchParams),
  });
  
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <TutorSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Courses items={courses} />
        <TutorsList items={tutors} />
      </div>
    </>
  );
};
export default TutorSearchPage;
