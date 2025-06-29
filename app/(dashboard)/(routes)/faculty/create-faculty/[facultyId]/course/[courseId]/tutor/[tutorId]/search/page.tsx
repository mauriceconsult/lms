import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TutorSearchInput } from "./_components/tutor-search-input";
import { TutorsList } from "./_components/tutors-list";
import { Courses } from "./_components/courses";
import { getTutors } from "@/actions/get-tutors";


interface TutorSearchPageProps {
  searchParams: {
    title: string;
    courseId: string;
  };
}
const TutorSearchPage = async ({
  searchParams,
}: TutorSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const courses = await db.course.findMany({
    orderBy: {
      title: "asc",
    },
  });
  const tutors = await getTutors({
    userId,
    ...searchParams
  })

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
