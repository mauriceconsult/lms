import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DataTable } from "./_components/tutor-data-table";
import { columns } from "./_components/tutor-columns";


interface TutorsPageProps {
  params: Promise<{
    facultyId: string;
    courseId: string;
    tutorId: string;
  }>;
}

export default async function TutorsPage({ params }: TutorsPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const { facultyId, courseId } = await params;

  const tutors = await db.tutor.findMany({
    where: {
      courseId,
      userId,
    },
    select: {
      id: true,
      title: true,
      facultyId: true,
      courseId: true,
      description: true,
      videoUrl: true,      
      position: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6">Tutors</h1>
      <DataTable columns={columns} data={tutors} courseId={courseId} facultyId={facultyId} />
    </div>
  );
};
