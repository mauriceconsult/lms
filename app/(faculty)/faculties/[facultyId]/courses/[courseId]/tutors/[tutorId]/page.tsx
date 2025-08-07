import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseEnrollButton } from "./_components/course-enroll-button";


export default async function TutorIdPage({
  params,
}: {
  params: Promise<{ facultyId: string; courseId: string; tutorId: string }>;
}) {
  const { facultyId, courseId, tutorId } = await params;

  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const tutor = await db.tutor.findUnique({
    where: { id: tutorId, courseId, course: { facultyId } },
    include: {
      course: {
        select: { id: true, title: true, amount: true, isPublished: true },
      },
    },
  });

  if (!tutor || !tutor.course) {
    return redirect(`/faculties/${facultyId}/courses/${courseId}`);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium text-gray-900 mb-4">
        {tutor.title || "Untitled Tutor"}
      </h1>
      <p className="text-sm text-gray-600 mb-4">Course: {tutor.course.title}</p>
      {!isAdmin && tutor.course.isPublished && (
        <CourseEnrollButton courseId={courseId} amount={tutor.course.amount} />
      )}
      {isAdmin && (
        <p className="text-sm text-gray-600">
          Admin view: Edit tutor details here.
        </p>
      )}
    </div>
  );
}
