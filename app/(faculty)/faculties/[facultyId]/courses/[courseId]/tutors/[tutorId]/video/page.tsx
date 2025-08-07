import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import VideoUploadForm from "../_components/video-upload-form";

export default async function TutorVideoUploadPage({
  params,
}: {
  params: { facultyId: string; courseId: string; tutorId: string };
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  if (!isAdmin) {
    return redirect(`/faculties/${params.facultyId}/courses/${params.courseId}`);
  }

  const tutor = await db.tutor.findUnique({
    where: { id: params.tutorId, courseId: params.courseId },
  });

  if (!tutor) {
    return redirect(`/faculties/${params.facultyId}/courses/${params.courseId}`);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium text-gray-900 mb-4">
        Upload Video for {tutor.title}
      </h1>
      <VideoUploadForm
        tutorId={params.tutorId}
        courseId={params.courseId}
        facultyId={params.facultyId}
      />
    </div>
  );
}
