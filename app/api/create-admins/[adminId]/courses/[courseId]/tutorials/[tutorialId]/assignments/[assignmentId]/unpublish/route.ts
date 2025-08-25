import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ adminId: string; courseId: string; tutorialId: string; assignmentId: string; }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownAssignment = await db.assignment.findUnique({
      where: {
        id: (await params).assignmentId,
        userId,
      },
    });
    if (!ownAssignment) {
      return new NextResponse("Unauthorized", { status: 401 });
    }   

    const unpublishedAssignment = await db.assignment.update({
      where: {
        id: (await params).assignmentId,
        tutorId: (await params).tutorialId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedAssignments = await db.assignment.findMany({
      where: {
        id: (await params).assignmentId,
        tutorId: (await params).tutorialId,
        isPublished: true,
      },
    });
    if (!publishedAssignments.length) {
      await db.tutor.update({
        where: {
          id: (await params).tutorialId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(unpublishedAssignment);
  } catch (error) {
    console.log("[ASSIGNMENT_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
