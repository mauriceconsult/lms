import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: { params: { facultyId: string; courseId: string; assignmentId: string; tutorAssignmentId: string; } }
) {
  try {
    const { userId } = await auth();
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
      },
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
    const ownTutorAssignment = await db.tutorAssignment.findUnique({
      where: {
        id: params.tutorAssignmentId,
        userId,
      },
    });
    if (!ownTutorAssignment) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedTutorAssignment = await db.tutorAssignment.update({
      where: {
        id: params.tutorAssignmentId,
        assignmentId: params.assignmentId,
        userId,
      },
      data: {
        isSubmitted: true,
      },
    });
    const publishedTutorAssignments = await db.tutorAssignment.findMany({
      where: {
        id: params.tutorAssignmentId,
        assignmentId: params.assignmentId,
        isSubmitted: true,
      },
    });
    if (!publishedTutorAssignments.length) {
      await db.tutorAssignment.update({
        where: {
          id: params.assignmentId,
        },
        data: {
          isSubmitted: true,
        },
      });
    }
    return NextResponse.json(unpublishedTutorAssignment);
  } catch (error) {
    console.log("[TUTOR_ASSIGNMENT_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
