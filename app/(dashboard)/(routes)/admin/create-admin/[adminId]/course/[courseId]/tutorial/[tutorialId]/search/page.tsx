import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getTutors } from "@/actions/get-tutors";
import { TutorialSearchInput } from "./_components/tutor-search-input";
import { Courses } from "../../../search/_components/courses";
import TutorList from "./_components/tutors-list";


interface TutorSearchPageProps {
  searchParams: Promise<{
    title?: string;
    courseId?: string;
    adminId?: string;
    tutorialId?: string;
  }>;
}

const TutorSearchPage = async ({ searchParams }: TutorSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const resolvedParams = await searchParams;
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  const tutorials = await getTutors({
    userId,
    title: resolvedParams.title,
    courseId: resolvedParams.courseId,
  });

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="px-6 pt-4 md:hidden md:mb-0 block">
        <TutorialSearchInput />
      </div>
      <div className="p-6 space-y-6">
        <Courses items={courses} />
        <TutorList
          items={tutorials}
          courseId={resolvedParams.courseId ?? ""}
          adminId={resolvedParams.adminId ?? ""}
        />
      </div>
    </div>
  );
};

export default TutorSearchPage;
