// app/tutorial-search-page.tsx
import { db } from "@/lib/db";
import { TutorialSearchInput } from "./_components/tutor-search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTutors } from "@/actions/get-tutors";
import { Courses } from "../../../search/_components/courses";
import TutorList from "./_components/tutors-list";
// import TutorList from "./_components/tutor-list";

interface TutorialSearchPageProps {
  searchParams: Promise<{
    title: string;
    adminId: string;
    courseId: string;
    tutorialId: string;
  }>;
}

const TutorialSearchPage = async ({
  searchParams,
}: TutorialSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const resolvedSearchParams = await searchParams;
  const title = Array.isArray(resolvedSearchParams.title)
    ? resolvedSearchParams.title[0]
    : resolvedSearchParams.title ?? "";
  const courseId = Array.isArray(resolvedSearchParams.courseId)
    ? resolvedSearchParams.courseId[0]
    : resolvedSearchParams.courseId ?? "";
  // const tutorialId = Array.isArray(resolvedSearchParams.tutorialId)
  //   ? resolvedSearchParams.tutorialId[0]
  //   : resolvedSearchParams.tutorialId ?? "";

  const courses = await db.course.findMany({
    orderBy: {
      title: "asc",
    },
  });

  const tutors = await getTutors({
    userId,
    title,
    courseId,
  });

  // Check if user is enrolled in the course
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });
  const isEnrolled = !!enrollment;

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <TutorialSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Courses items={courses} />
        <TutorList
          tutorials={tutors}
          courseId={courseId}
          isEnrolled={isEnrolled}
        />
      </div>
    </>
  );
};

export default TutorialSearchPage;
