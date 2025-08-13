import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AssignmentIdPageClient from "./_components/assignment-id-client-page";

interface AssignmentIdPageProps {
  params: Promise<{
    facultyId: string;
    courseId: string;
    assignmentId: string;
  }>;
}

export default async function AssignmentIdPage({
  params,
}: AssignmentIdPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { facultyId, courseId, assignmentId } = await params;

  const assignment = await db.assignment.findUnique({
    where: {
      id: assignmentId,
      userId,
    },
    select: {
      id: true,
      userId: true,
      title: true,
      description: true,
      objective: true,
      isCompleted: true,
      position: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      tutorId: true,
      adminId: true,
      attachments: {
        select: {
          id: true,
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

  const tutor = await db.tutor.findUnique({
    where: {
      id: assignment?.tutorId ?? "", // Use tutorId from assignment
      userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      userId: true,
      facultyId: true,
      position: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      objective: true, // Add missing fields
      adminId: true,
      courseId: true,
      videoUrl: true,
      playbackId: true,
      isFree: true,
      muxDataId: true,
    },
  });

  if (!assignment || !tutor) {
    return redirect("/");
  }

  return (
    <AssignmentIdPageClient
      assignment={assignment}
      tutor={tutor}
      courseId={courseId}
      facultyId={facultyId}
      tutorId={assignment.tutorId ?? ""}
      assignmentId={assignmentId}
    />
  );
}
