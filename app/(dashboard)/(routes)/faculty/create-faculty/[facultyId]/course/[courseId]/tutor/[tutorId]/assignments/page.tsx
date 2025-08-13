import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DataTable } from "./_components/assignment-data-table";
import { columns } from "./_components/assignment-columns";


interface AssignmentsPageProps {
  params: Promise<{
    facultyId: string;
    courseId: string;
    tutorId: string;
    assignmentId: string;
  }>;
}

export default async function AssignmentsPage({ params }: AssignmentsPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { facultyId, courseId, tutorId } = await params;

  const tutor = await db.tutor.findUnique({
    where: {
      id: tutorId,
      facultyId,
      courseId,      
      userId,
    },
    select: { id: true, courseId: true },
  });

  if (!tutor || !tutor.courseId) {
    return redirect(`/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/${tutorId}/assignments/search`);
  }

  const assignments = await db.assignment.findMany({
    where: {
      tutorId,
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
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6">Assignments</h1>
      <DataTable columns={columns} data={assignments} facultyId={facultyId} />
    </div>
  );
}