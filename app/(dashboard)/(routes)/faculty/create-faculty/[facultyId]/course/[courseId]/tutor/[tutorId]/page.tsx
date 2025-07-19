import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TutorIdPageClient from "./_components/tutor-id-page-client";


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
    include: {     
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const course = await db.course.findMany({
    orderBy: {
      title: "asc",
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
}
