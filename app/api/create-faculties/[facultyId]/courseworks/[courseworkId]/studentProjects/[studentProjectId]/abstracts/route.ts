import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  request: Request,
  { params }: { params: { facultyId: string;  courseworkId: string; studentProjectId: string } }
) {
  const body = await request.json();
  const { abstract } = body;
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!abstract || abstract.length === 0) {
    return new Response("No data provided", { status: 400 });
  }
  const studentProject = await db.studentProject.findUnique({
    where: {
      id: params.studentProjectId,
      userId,
    },
  });
  if (!studentProject) {
    return new Response("Student Project not found", { status: 404 });
  }
  await db.studentProject.update({
    where: {
      id: studentProject.id,
    },
    data: {
      abstract,      
    },
  });
  return new Response("Success", { status: 200 });
}