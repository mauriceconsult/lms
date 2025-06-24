import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: { facultyId: string } }
) {
  const body = await request.json();
  const { imageUrl } = body;
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!imageUrl || imageUrl.length === 0) {
    return new Response("No data provided", { status: 400 });
  }
  const faculty = await db.faculty.findUnique({
    where: {
      id: params.facultyId,
      userId,
    },
  });
  if (!faculty) {
    return new Response("Faculty not found", { status: 404 });
  }
  await db.faculty.update({
    where: {
      id: faculty.id,
    },
    data: {
      imageUrl,
    },
  });
  return new Response("Success", { status: 200 });
}

