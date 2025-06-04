import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  request: Request,
  { params }: { params: { facultyId: string } }
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
  const faculty = await db.faculty.findUnique({
    where: {
      id: params.facultyId,
      userId,
    },
    include: {
      noticeBoard: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  const noticeBoard = await db.noticeBoard.findUnique({
    where: {
      id: params.facultyId,
    },
  });
  if (!noticeBoard || !faculty) {
    return new Response("Noticeboard not found", { status: 404 });
  }
  const lastNotice = await db.noticeBoard.findFirst({
    where: {
      id: params.facultyId,
    },
    orderBy: {
      position: "desc",
    },
  });
  const newPosition = lastNotice ? (lastNotice.position ?? 0) + 1 : 1;

  await db.noticeBoard.create({
    data: {
      title: title,
      id: params.facultyId,
      position: newPosition,
    },
  });
  return new Response("Success", { status: 200 });
}
