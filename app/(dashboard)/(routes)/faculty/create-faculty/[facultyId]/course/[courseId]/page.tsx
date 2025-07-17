import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseIdPageClient from "./_components/course-id-page-client";

interface CourseIdPageProps {
  params: Promise<{
    facultyId: string;
    courseId: string;
  }>;
}

export default async function CourseIdPage({ params }: CourseIdPageProps) {
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
    include: {
      courseNoticeboards: true,
      assignments: true,
      tuitions: true,
      tutors: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const faculty = await db.faculty.findMany({
    orderBy: {
      title: "asc",
    },
  });

  if (!faculty || !course) {
    return redirect("/");
  }

  return (
    <CourseIdPageClient
      course={course}
      faculty={faculty}
      facultyId={facultyId}
      courseId={courseId}
    />
  );
}
