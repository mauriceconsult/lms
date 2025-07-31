import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"; // Server-side auth
import { redirect } from "next/navigation";
import Link from "next/link";
import { Prisma } from "@prisma/client"; // Import Prisma types
import { revalidatePath } from "next/cache";
import TutorIdPage from "./tutors/[tutorId]/page";
import PaymentForm from "./_components/payment-form";

const courseInclude = Prisma.validator<Prisma.CourseInclude>()({
  tuitions: {
    where: { isPaid: true },
  },
  tutors: {
    where: { isPublished: true },
    orderBy: { position: "asc" },
  },
  assignments: {
    where: { isPublished: true },
    orderBy: { createdAt: "asc" },
  },
});

type CourseWithRelations = Prisma.CourseGetPayload<{
  include: typeof courseInclude;
}>;

export default async function CourseIdPage({
  params,
}: {
  params: { facultyId: string; courseId: string };
}) {
  const authResult = await auth();
  if (!authResult.userId) {
    redirect("/");
  }

  const { facultyId, courseId } = params;

  const course: CourseWithRelations | null = await db.course.findUnique({
    where: { id: courseId, facultyId, isPublished: true },
    include: courseInclude,
  });

  if (!course) {
    redirect("/");
  }

  const hasTutorWithVideo = course.tutors.some((tutor) => tutor.videoUrl);
  if (!hasTutorWithVideo) {
    return (
      <p>This course cannot be previewed or sold without a video tutorial.</p>
    );
  }

  const hasPaidTuition = course.tuitions.some(
    (t) => t.isPaid && t.userId === authResult.userId
  );

  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  const displayAmount = course.amount
    ? parseFloat(course.amount as string).toFixed(2)
    : "N/A";

  // Admin check (simplified; adjust based on your role system)
  const isAdmin = authResult.userId === "admin-user-id"; // Replace with actual admin check

  const createInitialTutor = async (formData: FormData) => {
    "use server";
    const videoUrl = formData.get("videoUrl") as string;
    const title = formData.get("title") as string;

    if (!videoUrl) {
      throw new Error("Video URL is required");
    }

    await db.tutor.create({
      data: {
        id: crypto.randomUUID(), // Generate a unique ID
        courseId,
        videoUrl,
        title,
        isPublished: true,
        position: 1,
        userId: authResult.userId, // Add the admin's userId
      },
    });

    revalidatePath(`/faculties/${facultyId}/courses/${courseId}`);
    redirect(`/faculties/${facultyId}/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          {course.description && (
            <p className="mt-2 text-gray-600">
              {stripHtml(course.description)}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Amount: {displayAmount} EUR
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Course Preview
          </h2>
          {hasPaidTuition ? (
            <TutorIdPage
              params={{ facultyId, courseId, tutorId: course.tutors[0].id }}
            />
          ) : (
            <>
              <div className="relative">
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl">
                  Video Locked - Enroll to Unlock
                </div>
                <TutorIdPage
                  params={{ facultyId, courseId, tutorId: course.tutors[0].id }}
                />
              </div>
              <PaymentForm
                courseId={courseId}
                facultyId={facultyId}
                amount={course.amount ? parseFloat(course.amount as string) : 0}
              />
            </>
          )}
        </div>

        {isAdmin && !hasTutorWithVideo && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Admin: Add Initial Tutor
            </h2>
            <form action={createInitialTutor}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tutor Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="videoUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  Video URL (Mux Playback ID)
                </label>
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create Tutor
              </button>
            </form>
          </div>
        )}

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
                    Amount: {displayAmount} EUR
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

        {hasPaidTuition && (
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
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tutors available.</p>
            )}
          </div>
        )}

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
