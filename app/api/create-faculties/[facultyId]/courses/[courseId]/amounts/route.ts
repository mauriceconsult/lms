import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: { facultyId: string; courseId: string } }
) {
  const body = await request.json();
  const { amount } = body;
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!amount || amount.length === 0) {
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
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      facultyId: params.facultyId,
      userId,
    },
  });
  if (!course) {
    return new Response("Faculty not found", { status: 404 });
  }
  await db.course.update({
    where: {
      id: course.id,
    },
    data: {
      amount,
    },
  });
  return new Response("Success", { status: 200 });
}
