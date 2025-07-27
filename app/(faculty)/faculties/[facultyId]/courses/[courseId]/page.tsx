import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CourseEnrollButton } from "./tutors/[tutorId]/_components/course-enroll-button";

export default async function CourseIdPage({
  params,
}: {
  params: Promise<{ facultyId: string; courseId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const { facultyId, courseId } = await params;

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      facultyId,
      isPublished: true,
    },
    include: {
      tuitions: {
        where: { userId }, // Check if user has tuition
      },
      tutors: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
      assignments: {
        where: { isPublished: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!course) {
    redirect("/");
  }

  const hasTuition = course.tuitions.length > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          {course.description && (
            <p className="mt-2 text-gray-600">{course.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Amount: {course.amount ? parseFloat(course.amount).toFixed(2) : "N/A"} EUR
          </p>
          {!hasTuition && (
            <CourseEnrollButton
              courseId={course.id}
              courseTitle={course.title}
              amount={course.amount}
            />
          )}
        </div>

        {/* Tuitions Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tuitions</h2>
          {course.tuitions.length ? (
            <div className="space-y-4">
              {course.tuitions.map((tuition) => (
                <div key={tuition.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <p className="text-sm text-gray-600">
                    Amount: {course.amount ? parseFloat(course.amount).toFixed(2) : "N/A"} EUR
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(tuition.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tuitions available.</p>
          )}
        </div>

        {/* Tutors Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tutors</h2>
          {course.tutors.length ? (
            <div className="space-y-4">
              {course.tutors.map((tutor) => (
                <Link
                  key={tutor.id}
                  href={`/faculties/${facultyId}/courses/${courseId}/tutors/${tutor.id}`}
                  className="block"
                >
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                    <p className="text-sm font-medium text-gray-900">{tutor.title || "Untitled Tutor"}</p>
                    <p className="text-sm text-gray-600">{tutor.userId || "No User ID"}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tutors available.</p>
          )}
        </div>

        {/* Assignments Section */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignments</h2>
          {course.assignments.length ? (
            <div className="space-y-4">
              {course.assignments.map((assignment) => (
                <div key={assignment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <p className="text-sm text-gray-600">Assignment ID: {assignment.id}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(assignment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No assignments available.</p>
          )}
        </div>
      </div>
    </div>
  );
}