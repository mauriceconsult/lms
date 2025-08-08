import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Banner } from "@/components/banner";
import MuxPlayer from "@mux/mux-player-react";
import Link from "next/link";
import { CourseEnrollButton } from "./_components/course-enroll-button";

export default async function TutorIdPage({
  params,
  searchParams,
}: {
  params: Promise<{ facultyId: string; courseId: string; tutorId: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const { facultyId, courseId, tutorId } = await params;
  const { role } = await searchParams;
  const { userId } = await auth();

  if (!userId) {
    return redirect(
      `/sign-in?redirect=/faculties/${facultyId}/courses/${courseId}/tutors/${tutorId}`
    );
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const selectedRole = role === "admin" && isAdmin ? "admin" : "student";

  const tutor = await db.tutor.findUnique({
    where: {
      id: tutorId,
      courseId,
      ...(isAdmin ? {} : { isPublished: true }), // Allow admins to see drafts
    },
    include: {
      course: {
        select: {
          title: true,
          isPublished: true,
          amount: true,
        },
      },
    },
  });

  if (!tutor || !tutor.course) {
    return redirect(`/faculties/${facultyId}/courses/${courseId}`);
  }

  const enrollment = await db.enrollment.findFirst({
    where: { userId, courseId },
  });

  const isEnrolled = !!enrollment;

  const progress = await db.userProgress.findMany({
    where: { userId, tutorId: { in: [tutorId] } },
    select: { isCompleted: true },
  });

  const totalVideos = 1;
  const completedVideos = progress.filter((p) => p.isCompleted).length;
  const progressPercentage = (completedVideos / totalVideos) * 100;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {!isEnrolled && (
        <Banner
          variant="warning"
          label="You need to enroll in this course to watch this video."
        />
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium text-gray-900">
            {tutor.title || "Untitled Tutor"}
          </h1>
          <p className="text-sm text-gray-600">
            Course:{" "}
            <Link
              href={`/faculties/${facultyId}/courses/${courseId}`}
              className="text-blue-600 hover:underline"
            >
              {tutor.course.title || "Untitled Course"}
            </Link>
          </p>
        </div>
      </div>
      <div className="mb-6">
        {tutor.playbackId ? (
          <MuxPlayer
            playbackId={tutor.playbackId}
            className="w-full h-[400px] rounded-md"
            no-controls={!isEnrolled}
            metadata={{
              video_id: tutorId,
              video_title: tutor.title,
              viewer_user_id: userId,
            }}
          />
        ) : (
          <div className="w-full h-[400px] bg-gray-200 rounded-md flex items-center justify-center">
            <p className="text-gray-600">No video available</p>
          </div>
        )}
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Your Progress
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {progressPercentage.toFixed(0)}% Complete
        </p>
      </div>
      {!isEnrolled && (
        <div className="mb-6">
          <CourseEnrollButton
            courseId={courseId}
            amount={tutor.course.amount || "0.00"}
          />
        </div>
      )}
      {selectedRole === "admin" && (
        <div className="mt-6">
          <Link
            href={`/faculties/${facultyId}/courses/${courseId}/tutors/${tutorId}/edit?role=admin`}
          >
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Edit Tutor
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
