"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ErrorBoundary from "@/components/error-boundary";
import EnrollButton from "./_components/enroll-button";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} CoursePage] No userId, redirecting to /sign-in`
    );
    return redirect("/sign-in");
  }

  const { courseId } = await params;
  if (!courseId || typeof courseId !== "string") {
    console.log(
      `[${new Date().toISOString()} CoursePage] Invalid courseId, redirecting to /`
    );
    return redirect("/");
  }

  try {
    // Check enrollment status
    const enrollment = await db.userProgress.findFirst({
      where: {
        userId,
        courseId,
        isEnrolled: true,
      },
      select: { id: true, tutorId: true },
    });

    // Fetch first tutor (prioritize free tutors)
    const firstTutor =
      (await db.tutor.findFirst({
        where: { courseId, isPublished: true, isFree: true },
        select: { id: true, isFree: true, videoUrl: true },
        orderBy: { position: "asc" },
      })) ||
      (await db.tutor.findFirst({
        where: { courseId, isPublished: true },
        select: { id: true, isFree: true, videoUrl: true },
        orderBy: { position: "asc" },
      }));

    // Redirect to player page if enrolled or tutor is free
    if (enrollment || (firstTutor && firstTutor.isFree)) {
      if (!firstTutor) {
        console.log(
          `[${new Date().toISOString()} CoursePage] No tutors available for courseId: ${courseId}`
        );
        return redirect("/");
      }
      // Enroll user for free tutor
      if (firstTutor.isFree && !enrollment) {
        const firstCoursework = await db.coursework.findFirst({
          where: { courseId },
          select: { id: true },
        });
        const firstAssignment = await db.assignment.findFirst({
          where: { tutorId: firstTutor.id },
          select: { id: true },
        });
        await db.userProgress.create({
          data: {
            userId,
            courseId,
            tutorId: firstTutor.id,
            courseworkId: firstCoursework?.id || null,
            assignmentId: firstAssignment?.id || null,
            isEnrolled: true,
            isCompleted: false,
          },
        });
        console.log(
          `[${new Date().toISOString()} CoursePage] Enrolled user for free tutor:`,
          {
            userId,
            courseId,
            tutorId: firstTutor.id,
          }
        );
      }
      console.log(
        `[${new Date().toISOString()} CoursePage] Redirecting to /tutor/${
          firstTutor.id
        }`
      );
      return redirect(`/tutor/${firstTutor.id}`);
    }

    // Fetch course details
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        amount: true,
        facultyId: true,
      },
    });

    if (!course) {
      console.log(
        `[${new Date().toISOString()} CoursePage] Course not found for courseId: ${courseId}, redirecting to /`
      );
      return redirect("/");
    }

    console.log(`[${new Date().toISOString()} CoursePage] Course response:`, {
      courseId: course.id,
      title: course.title,
      imageUrl: course.imageUrl,
      amount: course.amount,
      facultyId: course.facultyId,
    });

    return (
      <ErrorBoundary>
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-medium">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>
          {firstTutor?.videoUrl ? (
            <div className="mt-4">
              <video
                className="w-full rounded-md"
                src={firstTutor.videoUrl}
                controls
                poster={course.imageUrl ?? undefined}
              />
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No preview video available</p>
          )}
          {course.amount && Number(course.amount) > 0 && (
            <EnrollButton courseId={courseId} />
          )}
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error(`[${new Date().toISOString()} CoursePage] Error:`, error);
    return (
      <ErrorBoundary>
        <div className="p-6">
          <h2 className="text-2xl font-medium">Error</h2>
          <p className="text-red-500">Failed to load course</p>
        </div>
      </ErrorBoundary>
    );
  }
}
