import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/course-card";

export default async function FacultyPage({
  params,
}: {
  params: Promise<{ facultyId: string }>;
}) {
  const { facultyId } = await params;

  const faculty = await db.faculty.findUnique({
    where: { id: facultyId },
    select: { id: true, title: true },
  });

  if (!faculty) {
    notFound();
  }

  const courses = await db.course.findMany({
    where: { facultyId, isPublished: true },
    include: {
      tutors: {
        select: { id: true, title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {faculty.title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
