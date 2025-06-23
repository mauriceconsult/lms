import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: { facultyId: string; noticeboardId: string } }
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
  const noticeboard = await db.noticeboard.findUnique({
    where: {
      id: params.noticeboardId,
      facultyId: params.facultyId,
      userId,
    },
  });
  if (!noticeboard) {
    return new Response("Faculty not found", { status: 404 });
  }
  await db.noticeboard.update({
    where: {
      id: noticeboard.id,
    },
    data: {
      description,
    },
  });
  return new Response("Success", { status: 200 });
}
