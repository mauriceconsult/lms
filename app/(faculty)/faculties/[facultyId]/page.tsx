import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/course-card";
import { CourseWithProgressWithFaculty } from "@/actions/get-dashboard-courses";
import { currentUser } from "@clerk/nextjs/server"; // Adjust for your auth provider

export default async function FacultyPage({
  params,
}: {
  params: Promise<{ facultyId: string }>;
}) {
  const { facultyId } = await params;
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    return <div>Please log in to view courses.</div>;
  }

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
      faculty: {
        select: {
          id: true,
          title: true,
          userId: true,
          description: true,
          imageUrl: true,
          position: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          schoolId: true,
        },
      },
      tuitions: {
        where: { userId },
        select: {
          id: true,
          userId: true,
          courseId: true,
          amount: true,
          status: true,
          partyId: true,
          username: true,
          transactionId: true,
          isActive: true,
          isPaid: true,
          transId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      userProgress: {
        where: { userId },
        select: { isCompleted: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const coursesWithProgress: CourseWithProgressWithFaculty[] = courses.map(
    (course) => ({
      ...course,
      progress: course.userProgress[0]?.isCompleted ? 100 : 0,
      tuition: course.tuitions[0] || null,
    })
  );

  console.log("Courses with progress:", coursesWithProgress); // Debug

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {faculty.title}
        </h1>
        {coursesWithProgress.length === 0 ? (
          <p>No courses available for this faculty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coursesWithProgress.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
