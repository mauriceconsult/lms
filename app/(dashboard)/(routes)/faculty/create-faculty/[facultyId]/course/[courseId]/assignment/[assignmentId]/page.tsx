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

export default async function AssignmentIdPage({ params }: AssignmentIdPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { facultyId, courseId, assignmentId } = await params;

  const assignment = await db.assignment.findUnique({
    where: {
      id: assignmentId,
      courseId,
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
      courseId: true,
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
          tutorAssignmentId: true,
          payrollId: true,
          facultyPayrollId: true,
          studentProjectId: true,
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
      userId: true,
    },
  });

  if (!course || !assignment) {
    return redirect("/");
  }

  return (
    <AssignmentIdPageClient
      assignment={assignment}
      course={course}
      facultyId={facultyId}
      courseId={courseId}
      assignmentId={assignmentId}
    />
  );
};
