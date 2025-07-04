import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: {
      facultyId: string;
      courseId: string;
      assignmentId: string;
      tutorAssignmentId: string;
    };
  }
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
  const faculty = await db.faculty.findUnique({
    where: {
      id: params.facultyId,
      userId,
    },
  });
  if (!faculty) {
    return new Response("Assignment not found", { status: 404 });
  }
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
  });
  if (!course) {
    return new Response("Assignment not found", { status: 404 });
  }
  const assignment = await db.assignment.findUnique({
    where: {
      id: params.assignmentId,
      userId,
    },
  });
  if (!assignment) {
    return new Response("Assignment not found", { status: 404 });
  }
  const tutorAssignment = await db.tutorAssignment.findUnique({
    where: {
      id: params.tutorAssignmentId,
      userId,
    },
  });
  if (!tutorAssignment) {
    return new Response("Assignment not found", { status: 404 });
  }
  await db.tutorAssignment.update({
    where: {
      id: tutorAssignment.id,
    },
    data: {
      description,
    },
  });
  return new Response("Success", { status: 200 });
}
