import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { facultyId: string; courseId: string; assignmentId: string; } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const faculty = await db.faculty.findUnique({
      where: {
        id: params.facultyId,
        userId: userId,
      },
    });
    if (!faculty) {
      return new NextResponse("Not found", { status: 404 });
    }
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }
    const assignment = await db.assignment.findUnique({
      where: {
        id: params.assignmentId,
        courseId: params.courseId,
        userId,
      },
    });
    if (!assignment) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedTopic = await db.assignment.delete({
      where: {
        id: params.assignmentId,
      },
    });
    return NextResponse.json(deletedTopic);
  } catch (error) {
    console.log("[ASSIGNMENT_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { facultyId: string; courseId: string; assignmentId: string; } }
) {
  try {
    const { userId } = await auth();
    const { facultyId, courseId, assignmentId } = params;
    const values = await req.json();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const faculty = await db.faculty.findUnique({
      where: {
        id: facultyId,
        userId,
      },
    });
    if (!faculty) {
      return new NextResponse("Not found", { status: 404 });
    }
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }
    const objective = await db.assignment.update({
      where: {
        id: assignmentId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(objective);
  } catch (error) {
    console.log("[ASSIGNMENT_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
