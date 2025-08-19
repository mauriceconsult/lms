import { auth } from "@clerk/nextjs/server";
import CourseNavbar from "./_components/course-navbar";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";
import CourseSidebar from "./courses/[courseId]/_components/course-sidebar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      tutors: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: { userId },
            select: {
              id: true,
              userId: true,
              courseId: true,
              tutorId: true,
              courseworkId: true,
              assignmentId: true,
              isCompleted: true,
              isEnrolled: true,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
      userProgress: {
        where: { userId },
        select: {
          id: true,
          userId: true,
          courseId: true,
          tutorId: true,
          courseworkId: true,
          assignmentId: true,
          isCompleted: true,
          isEnrolled: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const progressCount = await getProgress({ userId, courseId: course.id });

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <CourseNavbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default CourseLayout;
