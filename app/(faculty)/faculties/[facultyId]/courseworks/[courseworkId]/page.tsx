import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseworkIdClient from "./_components/coursework-id-client";

export default async function CourseworkIdPage({
  params,
}: {
  params: Promise<{ facultyId: string; courseworkId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const { facultyId, courseworkId } = await params;

  const coursework = await db.coursework.findUnique({
    where: { id: courseworkId, facultyId, isPublished: true },
  });

  if (!coursework) {
    redirect("/");
  }

  return (
    <CourseworkIdClient
      coursework={coursework}
      userId={userId}
      facultyId={facultyId}
      courseworkId={courseworkId}
    />
  );
}
