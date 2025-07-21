import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TutorIdPageClient from "./_components/tutor-id-client-page";

interface TutorIdPageProps {
  params: Promise<{
    facultyId: string;
    courseId: string;
    tutorId: string;
  }>;
}

export default async function TutorIdPage({ params }: TutorIdPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { facultyId, courseId, tutorId } = await params;

  const tutor = await db.tutor.findUnique({
    where: {
      id: tutorId,
      courseId,
      userId,
    },
    select: {
      id: true,
      userId: true,
      title: true,
      description: true,
      objective: true,
      videoUrl: true,
      position: true,
      isPublished: true,
      isFree: true,
      createdAt: true,
      updatedAt: true,
      courseId: true,
      muxDataId: true,
      muxData: {
        select: {
          id: true,
          tutorId: true,
          assetId: true,
          playbackId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      attachments: {
        select: {
          id: true,
          name: true,
          url: true,
          facultyId: true,
          courseId: true,
          tutorId: true,
          noticeboardId: true,
          courseworkId: true,
          assignmentId: true,
          courseNoticeboardId: true,
          tuitionId: true,     
          payrollId: true,
          facultyPayrollId: true, 
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      facultyId,
      userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      amount: true,
      facultyId: true,
      position: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      userId: true, // Added userId
    },
  });

  if (!course || !tutor) {
    return redirect("/");
  }

  return (
    <TutorIdPageClient
      tutor={tutor}
      course={course}
      facultyId={facultyId}
      courseId={courseId}
      tutorId={tutorId}
    />
  );
};
