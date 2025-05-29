import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
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
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
  });
  if (!course) {
    return new Response("Course not found", { status: 404 });
  }
  const lastCourse = await db.course.findFirst({
    where: {
      id: params.courseId,      
    },
    orderBy: {
      position: "desc"
    }
  });
  const newPosition = lastCourse ? (lastCourse.position ?? 0) + 1 : 1;

  await db.course.create({    
    data: {
      title,
      id: params.courseId,
      position: newPosition,
      userId,
    },
  });
  return new Response("Success", { status: 200 });
}
