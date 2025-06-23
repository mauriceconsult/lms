import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: { facultyId: string; noticeboardId: string } }
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
  const noticeboard = await db.noticeboard.findUnique({
    where: {
      id: params.noticeboardId,
      facultyId: params.facultyId,
      userId,
    },
  });
  if (!noticeboard) {
    return new Response("Course not found", { status: 404 });
  }
  await db.noticeboard.update({
    where: {
      id: noticeboard.id,
    },
    data: {
      imageUrl,
    },
  });
  return new Response("Success", { status: 200 });
}
