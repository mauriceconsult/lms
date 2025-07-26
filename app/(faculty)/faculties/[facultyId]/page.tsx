import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function FacultyIdPage({
  params,
}: {
  params: Promise<{ facultyId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const faculty = await db.faculty.findUnique({
    where: {
      id: (await params).facultyId,
      isPublished: true,
    },
    include: {
      courses: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!faculty) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Faculty Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{faculty.title}</h1>
          {faculty.description && (
            <p className="mt-2 text-gray-600">{faculty.description}</p>
          )}
        </div>

        {/* Courses Section */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Courses</h2>
          {faculty.courses.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculty.courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/faculties/${faculty.id}/courses/${course.id}`}
                  className="block"
                >
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                    <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                    {course.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{course.description}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Amount: {course.amount ? parseFloat(course.amount).toFixed(2) : "N/A"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No published courses available.</p>
          )}
        </div>
      </div>
    </div>
  );
}