import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DataTable } from "./_components/tutor-data-table";
import { columns } from "./_components/tutor-columns";

interface TutorsPageProps {
  params: Promise<{
    facultyId: string;
    courseId: string;
  }>;
}

export default async function TutorsPage({ params }: TutorsPageProps) {
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
    return redirect(`/faculties/${facultyId}`);
  }

  const tutors = await db.tutor.findMany({
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
      position: true,
      isPublished: true,
      isFree: true,
      videoUrl: true,
      muxDataId: true,
      createdAt: true,
      updatedAt: true,
      courseId: true,
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6">Tutors</h1>
      <DataTable columns={columns} data={tutors} facultyId={facultyId} />
    </div>
  );
}