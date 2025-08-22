"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Image from "next/image";
import ErrorBoundary from "@/components/error-boundary";
import { CourseWithProgressWithFaculty } from "@/actions/get-dashboard-courses";
import { VideoPlayer } from "@/app/(course)/courses/[courseId]/(tutor)/tutors/[tutorId]/_components/video-player";
import TutorList from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/tutor/[tutorId]/search/_components/tutors-list";
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
    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
      include: {
        tutors: {
          select: { id: true, title: true, isFree: true, position: true, playbackId: true },
          orderBy: { position: "asc" },
        },
        faculty: {
          select: {
            id: true,
            title: true,
            userId: true,
            description: true,
            imageUrl: true,
            position: true,
            isPublished: true,
            createdAt: true,
            updatedAt: true,
            schoolId: true,
          },
        },
        tuitions: {
          where: { userId },
          select: {
            id: true,
            userId: true,
            courseId: true,
            amount: true,
            status: true,
            partyId: true,
            username: true,
            transactionId: true,
            isActive: true,
            isPaid: true,
            transId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        userProgress: {
          where: { userId },
          select: { isCompleted: true, isEnrolled: true, tutorId: true },
        },
      },
    });

    if (!course) {
      console.log(
        `[${new Date().toISOString()} CoursePage] Course not found for courseId: ${courseId}`
      );
      return redirect("/");
    }

    const totalTutors = course.tutors.length;
    const completedTutors = course.userProgress.filter((up) => up.isCompleted).length;
    const progress = totalTutors > 0 ? (completedTutors / totalTutors) * 100 : 0;
    const isEnrolled = course.userProgress[0]?.isEnrolled || false;
    const isPaid = course.tuitions[0]?.isPaid || false;

    const courseWithProgress: CourseWithProgressWithFaculty = {
      ...course,
      progress,
      tuition: course.tuitions[0] || null,
    };

    const firstNonFreeTutor = course.tutors.find((tutor) => !(tutor.isFree ?? false)) || course.tutors[0];

    console.log(`[${new Date().toISOString()} CoursePage] Course response:`, {
      courseId,
      title: course.title,
      isEnrolled,
      isPaid,
      progress,
      tutors: course.tutors.map((t) => ({ id: t.id, title: t.title, isFree: t.isFree })),
      firstNonFreeTutor: firstNonFreeTutor ? { id: firstNonFreeTutor.id, title: firstNonFreeTutor.title } : null,
    });

    return (
      <ErrorBoundary>
        <div className="flex min-h-screen bg-gray-50">
          <div className="w-64 bg-white p-4 border-r">
            <h2 className="text-xl font-semibold mb-4">Tutorials</h2>
            <TutorList tutors={course.tutors} courseId={courseId} isEnrolled={isEnrolled} />
          </div>
          <div className="flex-1 p-6">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <div className="mb-4">
              <span className="font-semibold">Description:</span>{" "}
              {course.description ?? "No description available"}
            </div>
            <div className="relative w-full h-40 mb-4">
              <Image
                src={course.imageUrl ?? "/placeholder.png"}
                alt={`${course.title} image`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                objectFit="cover"
                className="rounded-md"
                placeholder="blur"
                blurDataURL="/placeholder.png"
              />
            </div>
            {firstNonFreeTutor && (
              <div className="mb-4">
                <VideoPlayer
                  playbackId={firstNonFreeTutor.playbackId ?? ""}
                  courseId={courseId}
                  tutorId={firstNonFreeTutor.id}
                  nextTutorId={course.tutors[course.tutors.findIndex((t) => t.id === firstNonFreeTutor.id) + 1]?.id ?? ""}
                  isLocked={!(firstNonFreeTutor.isFree ?? false) && !isEnrolled}
                  completeOnEnd={!(firstNonFreeTutor.isFree ?? false) && isEnrolled}
                  title={firstNonFreeTutor.title}
                />
              </div>
            )}
            {isPaid ? (
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Progress:</span>{" "}
                  {courseWithProgress.progress?.toFixed(2) ?? "0.00"}%
                </div>
                <div>
                  <span className="font-semibold">Payment Status:</span>{" "}
                  {courseWithProgress.tuition?.status ?? "Not Enrolled"}
                </div>
                <div>
                  <span className="font-semibold">Amount:</span> $
                  {courseWithProgress.tuition?.amount &&
                  /^[0-9]+(\.[0-9]{1,2})?$/.test(courseWithProgress.tuition.amount)
                    ? parseFloat(courseWithProgress.tuition.amount).toFixed(2)
                    : "0.00"}
                </div>
                <div>
                  <span className="font-semibold">Faculty:</span>{" "}
                  {courseWithProgress.faculty?.title ?? "No Faculty"}
                </div>
              </div>
            ) : (
              <EnrollButton courseId={courseId} />
            )}
          </div>
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
