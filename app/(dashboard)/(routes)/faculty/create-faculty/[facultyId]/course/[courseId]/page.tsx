import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6">
        Course Page: {facultyId} / {courseId}
      </h1>
    </div>
  );
};
