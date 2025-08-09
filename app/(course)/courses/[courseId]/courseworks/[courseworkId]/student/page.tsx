import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function StudentCourseworkPage({
  params,
}: {
  params: Promise<{ facultyId: string; courseworkId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { facultyId, courseworkId } = await params;

  const coursework = await db.coursework.findUnique({
    where: { id: courseworkId },
    include: { faculty: true, attachments: true },
  });

  if (!coursework || coursework.facultyId !== facultyId) redirect("/");

  // Add enrollment check (e.g., via a Student model)
  const isEnrolled = true; // Placeholder
  if (!isEnrolled) redirect("/");

  return (
    <div className="p-6">
      <h1>{coursework.title}</h1>
      <p>{coursework.description}</p>
      {/* Display attachments */}
    </div>
  );
}
