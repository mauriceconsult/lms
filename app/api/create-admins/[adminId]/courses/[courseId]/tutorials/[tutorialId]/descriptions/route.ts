import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ adminId: string;  courseId: string; tutorialId: string }> }
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
  const tutorial = await db.tutor.findUnique({
    where: {
      id: (await params).tutorialId,
      userId,
    },
  });
  if (!tutorial) {
    return new Response("Tutor not found", { status: 404 });
  }
  await db.tutor.update({
    where: {
      id: tutorial.id,
    },
    data: {
      description,      
    },
  });
  return new Response("Success", { status: 200 });
}