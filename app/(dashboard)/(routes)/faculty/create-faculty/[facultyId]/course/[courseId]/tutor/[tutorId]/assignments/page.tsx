import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DataTable } from "./_components/assignment-data-table";
import { columns } from "./_components/assignment-columns";

interface AssignmentsPageProps {
  params: Promise<{
    facultyId: string;
    courseId: string;
  }>;
}

export default async function AssignmentsPage({ params }: AssignmentsPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { facultyId, courseId } = await params;

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      facultyId,
      userId,
    },
    select: { id: true, facultyId: true },
  });

  if (!course || !course.facultyId) {
    return redirect(`/faculty/create-faculty/${facultyId}`);
  }

  const assignments = await db.assignment.findMany({
    where: {
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
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6">Assignments</h1>
      <DataTable columns={columns} data={assignments} facultyId={facultyId} />
    </div>
  );
}