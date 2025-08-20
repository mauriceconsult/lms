"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ErrorBoundary from "@/components/error-boundary";
import { VideoPlayer } from "./_components/video-player";

export default async function TutorPage({
  params,
}: {
  params: Promise<{ tutorId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} TutorPage] No userId, redirecting to /sign-in`
    );
    return redirect("/sign-in");
  }

  const { tutorId } = await params;
  if (!tutorId || typeof tutorId !== "string") {
    console.log(
      `[${new Date().toISOString()} TutorPage] Invalid tutorId, redirecting to /`
    );
    return redirect("/");
  }

  try {
    // Fetch tutor details
    const tutor = await db.tutor.findUnique({
      where: { id: tutorId, isPublished: true },
      select: {
        id: true,
        courseId: true,
        title: true,
        playbackId: true,
        isFree: true,
        position: true,
      },
    });

    if (!tutor || !tutor.courseId) {
      console.log(
        `[${new Date().toISOString()} TutorPage] Tutor not found or missing courseId for tutorId: ${tutorId}`
      );
      return redirect("/");
    }

    // Fetch course details
    const course = await db.course.findUnique({
      where: { id: tutor.courseId },
      select: { id: true, title: true, amount: true },
    });

    if (!course || !course.id) {
      console.log(
        `[${new Date().toISOString()} TutorPage] Course not found for courseId: ${
          tutor.courseId
        }`
      );
      return redirect("/");
    }

    // Check enrollment status
    const enrollment = await db.userProgress.findFirst({
      where: {
        userId,
        courseId: tutor.courseId,
        isEnrolled: true,
      },
      select: { id: true },
    });

    // Determine if tutor is locked
    const isLocked = !tutor.isFree && !enrollment;

    // Fetch next tutor (for nextTutorId)
    const nextTutor = await db.tutor.findFirst({
      where: {
        courseId: tutor.courseId,
        isPublished: true,
        position: { gt: tutor.position },
      },
      select: { id: true },
      orderBy: { position: "asc" },
    });

    // Mark completion if completeOnEnd is true
    const completeOnEnd = !isLocked; // Complete only if accessible

    console.log(`[${new Date().toISOString()} TutorPage] Tutor response:`, {
      tutorId,
      courseId: tutor.courseId,
      title: tutor.title,
      isLocked,
      isFree: tutor.isFree,
      nextTutorId: nextTutor?.id,
    });

    return (
      <ErrorBoundary>
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-medium mb-4">{tutor.title}</h1>
          <VideoPlayer
            playbackId={tutor.playbackId ?? ""}
            courseId={tutor.courseId}
            tutorId={tutorId}
            nextTutorId={nextTutor?.id ?? ""}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            title={tutor.title}
          />
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error(`[${new Date().toISOString()} TutorPage] Error:`, error);
    return (
      <ErrorBoundary>
        <div className="p-6">
          <h2 className="text-2xl font-medium">Error</h2>
          <p className="text-red-500">Failed to load tutorial</p>
        </div>
      </ErrorBoundary>
    );
  }
}
