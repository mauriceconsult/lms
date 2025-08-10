import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function VideoPlayerPage({
  params,
}: {
  params: Promise<{ facultyId: string; courseId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect(
      `/sign-in?redirect=/faculties/${(await params).facultyId}/courses/${
        (await params).courseId
      }/tutors`
    );
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  if (isAdmin) {
    return redirect(
      `/faculties/${(await params).facultyId}/courses/${
        (await params).courseId
      }?role=admin`
    );
  }

  const { facultyId, courseId } = await params;

  const course = await db.course.findUnique({
    where: { id: courseId, facultyId, isPublished: true },
    select: { title: true },
  });

  if (!course) {
    return redirect(`/faculties/${facultyId}/courses`);
  }

  return (
    <div className="p-6">
      <Link
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
        href={`/faculties/${facultyId}/courses`}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Courses
      </Link>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">
          {course.title || "Untitled Course"}
        </h1>
        <p className="text-sm text-slate-700">Video Player Placeholder</p>
        <p className="text-sm text-slate-700">
          TODO: Implement video player (e.g., Mux integration) for course
          content.
        </p>
      </div>
    </div>
  );
}
