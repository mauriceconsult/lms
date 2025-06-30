import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { facultyId: string; courseId: string; assignmentId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownFaculty = await db.faculty.findUnique({
      where: {
        id: params.facultyId,
        userId,
      },
    });
    if (!ownFaculty) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCourse = await db.course.findUnique({
      where: { 
        id: params.courseId,
        userId,
      }
    });
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const assignment = await db.assignment.findUnique({
      where: {
        id: params.assignmentId,
        courseId: params.courseId,
      }
    });
 
    if (!assignment || !assignment.description || !assignment.title || !assignment.objective ) {
      return new NextResponse("Missing credentials", { status: 400 });
    }
    const publishedAssignment = await db.assignment.update({
      where: {
        id: params.assignmentId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      }
    });
    return NextResponse.json(publishedAssignment)
  } catch (error) {
    console.log("[ASSIGNMENT_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

