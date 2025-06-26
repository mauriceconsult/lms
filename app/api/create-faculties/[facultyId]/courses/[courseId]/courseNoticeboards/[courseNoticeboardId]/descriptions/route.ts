import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  request: Request,
  { params }: { params: { facultyId: string;  courseId: string; courseNoticeboardId: string } }
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
  const courseNoticeboard = await db.courseNoticeboard.findUnique({
    where: {
      id: params.courseNoticeboardId,
      userId,
    },
  });
  if (!courseNoticeboard) {
    return new Response("Course Noticeboard not found", { status: 404 });
  }
  await db.courseNoticeboard.update({
    where: {
      id: courseNoticeboard.id,
    },
    data: {
      description,      
    },
  });
  return new Response("Success", { status: 200 });
}