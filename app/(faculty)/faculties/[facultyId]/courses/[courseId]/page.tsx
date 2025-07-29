import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CourseEnrollButton } from "./tutors/[tutorId]/_components/course-enroll-button";
import bcrypt from "bcryptjs"; // Install with `npm install bcryptjs`

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
        where: { userId, courseId }, // Fetch all tuitions for this user and course
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

  const hasPaidTuition = course.tuitions.some(
    (tuition) => tuition.isPaid === true
  ); // Check for paid tuition

  // Function to strip HTML tags
  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/g, "") // Remove all tags
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          {course.description && (
            <p className="mt-2 text-gray-600">
              {stripHtml(course.description)}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Amount:{" "}
            {course.amount ? parseFloat(course.amount).toFixed(2) : "N/A"} EUR
          </p>
        </div>

        {/* Payment Form */}
        {!hasPaidTuition && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Enroll in Course
            </h2>
            <form
              action={async (formData) => {
                "use server"; // Server action syntax
                const username = formData.get("username")?.toString() || ""; // Default to empty string
                const partyId = formData.get("partyId")?.toString();
                if (!partyId) {
                  // Handle validation error
                  return;
                }
                // Hash partyId for storage
                const hashedPartyId = await bcrypt.hash(partyId, 12); // Cost factor 12
                // Placeholder for MOMO API call with original partyId
                // await triggerMomoCheckout({ courseId, amount: course.amount ?? "0.00", partyId, username });
                // After successful payment, create/update tuition with hashed partyId
                await db.tuition.upsert({
                  where: { userId_courseId: { userId, courseId } },
                  create: {
                    userId,
                    courseId,
                    isPaid: false,
                    username,
                    partyId: hashedPartyId,
                  }, // Use defaulted username
                  update: { isPaid: false, username, partyId: hashedPartyId },
                });
                redirect(`/faculties/${facultyId}/courses/${courseId}`);
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username (Optional)
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="partyId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Party ID (MSISDN) *
                </label>
                <input
                  type="text"
                  id="partyId"
                  name="partyId"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="e.g., +254712345678"
                />
              </div>
              <CourseEnrollButton
                courseId={course.id}
                amount={course.amount ?? "0.00"}
              />
            </form>
          </div>
        )}

        {/* Tuitions Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tuitions</h2>
          {course.tuitions.length ? (
            <div className="space-y-4">
              {course.tuitions.map((tuition) => (
                <div
                  key={tuition.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <p className="text-sm text-gray-600">
                    Amount:{" "}
                    {course.amount
                      ? parseFloat(course.amount).toFixed(2)
                      : "N/A"}{" "}
                    EUR
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(tuition.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Paid: {tuition.isPaid ? "Yes" : "No"}
                  </p>
                  {tuition.username && (
                    <p className="text-sm text-gray-500">
                      Username: {tuition.username}
                    </p>
                  )}
                  {tuition.partyId && (
                    <p className="text-sm text-gray-500">
                      Party ID: [Hashed] {tuition.partyId.slice(0, 10)}...
                    </p>
                  )}
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
                    <p className="text-sm font-medium text-gray-900">
                      {tutor.title || "Untitled Tutor"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {tutor.userId || "No User ID"}
                    </p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Assignments
          </h2>
          {course.assignments.length ? (
            <div className="space-y-4">
              {course.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <p className="text-sm text-gray-600">
                    Assignment ID: {assignment.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created:{" "}
                    {new Date(assignment.createdAt).toLocaleDateString()}
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
