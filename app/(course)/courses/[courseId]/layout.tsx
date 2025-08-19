"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";
import CourseSidebar from "./_components/course-sidebar";
import CourseNavbar from "./_components/course-navbar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} CourseLayout] No userId, redirecting to /`
    );
    return redirect("/");
  }

  const { courseId } = await params;
  console.log(`[${new Date().toISOString()} CourseLayout] Params:`, {
    courseId,
  });

  if (!courseId || typeof courseId !== "string") {
    console.log(
      `[${new Date().toISOString()} CourseLayout] Invalid courseId, redirecting to /`
    );
    return redirect("/");
  }

  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
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
      console.log(
        `[${new Date().toISOString()} CourseLayout] Course not found for courseId: ${courseId}, redirecting to /`
      );
      return redirect("/");
    }

    console.log(`[${new Date().toISOString()} CourseLayout] Course found:`, {
      courseId: course.id,
      title: course.title,
      imageUrl: course.imageUrl,
      facultyId: course.facultyId,
      tutors: course.tutors.map((t) => ({
        id: t.id,
        title: t.title,
        userProgress: t.userProgress.map((up) => ({
          id: up.id,
          isCompleted: up.isCompleted,
          isEnrolled: up.isEnrolled,
        })),
      })),
    });

    const progressCount = await getProgress({ userId, courseId: course.id });

    console.log(`[${new Date().toISOString()} CourseLayout] Progress count:`, {
      course: progressCount.course
        ? { id: progressCount.course.id, title: progressCount.course.title }
        : null,
      tutor: progressCount.tutor
        ? { id: progressCount.tutor.id, title: progressCount.tutor.title }
        : null,
      coursework: progressCount.coursework
        ? {
            id: progressCount.coursework.id,
            title: progressCount.coursework.title,
          }
        : null,
      assignment: progressCount.assignment
        ? {
            id: progressCount.assignment.id,
            title: progressCount.assignment.title,
          }
        : null,
      attachments:
        progressCount.attachments?.map((a) => ({ id: a.id, url: a.url })) || [],
    });

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
  } catch (error) {
    console.error(`[${new Date().toISOString()} CourseLayout] Error:`, error);
    return (
      <div className="p-6">
        <h2 className="text-2xl font-medium">Error</h2>
        <p className="text-red-500">Failed to load course layout</p>
      </div>
    );
  }
};

export default CourseLayout;
