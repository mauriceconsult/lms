import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ facultyId: string; courseworkId: string }> }
) {
  const body = await request.json();
  const { description } = body;
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!description || description.length === 0) {
    return new Response("No data provided", { status: 400 });
  }
  const coursework = await db.coursework.findUnique({
    where: {
      id: (await params).courseworkId,
      facultyId: (await params).facultyId,
      createdBy: userId,
    },
  });
  if (!coursework) {
    return new Response("Faculty not found", { status: 404 });
  }
  await db.coursework.update({
    where: {
      id: coursework.id,
    },
    data: {
      description,
    },
  });
  return new Response("Success", { status: 200 });
}
