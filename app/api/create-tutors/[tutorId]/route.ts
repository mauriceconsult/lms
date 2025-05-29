import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: { tutorId: string } }
) {
  const body = await request.json();
  const { title } = body;
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!title || title.length === 0) {
    return new Response("No data provided", { status: 400 });
  }
  const tutor = await db.tutor.findUnique({
    where: {
      id: params.tutorId,
      userId,
    },
  });
  if (!tutor) {
    return new Response("Tutor not found", { status: 404 });
  }
  await db.tutor.update({
    where: {
      id: tutor.id,
    },
    data: {
      title,      
    },
  });
  return new Response("Success", { status: 200 });
}