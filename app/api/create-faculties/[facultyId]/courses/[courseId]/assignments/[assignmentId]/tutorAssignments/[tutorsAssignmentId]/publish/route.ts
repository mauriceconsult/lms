import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { facultyId: string; courseId: string; assignmentId: string; tutorAssignmentId: string; } }
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
    const ownAssignment = await db.assignment.findUnique({
      where: {
        id: params.assignmentId,
        userId,
      },
    });
    if (!ownAssignment) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const tutorAssignment = await db.tutorAssignment.findUnique({
      where: {
        id: params.tutorAssignmentId,
        assignmentId: params.assignmentId,
      }
    });
 
    if (!tutorAssignment || !tutorAssignment.description || !tutorAssignment.title || !tutorAssignment.objective ) {
      return new NextResponse("Missing credentials", { status: 400 });
    }
    const publishedTutorAssignment = await db.tutorAssignment.update({
      where: {
        id: params.tutorAssignmentId,
        assignmentId: params.assignmentId,
      },
      data: {
        isSubmitted: true,
      }
    });
    return NextResponse.json(publishedTutorAssignment)
  } catch (error) {
    console.log("[TUTOR_ASSIGNMENT_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

