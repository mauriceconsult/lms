import { db } from "@/lib/db";
import { TutorialSearchInput } from "./_components/tutor-search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { TutorialsList } from "./_components/tutors-list";
// import { getTutorials } from "@/actions/get-tutors";
// import { Courses } from "../../../search/_components/courses";


interface TutorialSearchPageProps {
  searchParams: Promise<{
    title: string;
    adminId: string;
    courseId: string;
    tutorialId: string;
  }>;
}
const TutorialSearchPage = async ({
  searchParams
}: TutorialSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const courses = await db.course.findMany({
    orderBy: {
      title: "asc"
    }
  })
  const tutorials = await getTutorials({
    userId,
    ...(await searchParams),
  });
  
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <TutorialSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Courses items={courses} />
        <TutorialsList items={tutorials} />
      </div>
    </>
  );
};
export default TutorialSearchPage;
