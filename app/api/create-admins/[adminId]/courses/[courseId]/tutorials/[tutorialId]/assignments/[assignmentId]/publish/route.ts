import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      adminId: string;
      courseId: string;
      tutorialId: string;
      assignmentId: string;
    }>;
  }
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
    const assignment = await db.assignment.findUnique({
      where: {
        id: (await params).assignmentId,
        userId,
      },     
    });

    if (
      !assignment ||
      !assignment.description ||
      !assignment.title ||
      !assignment.tutorId
   
    ) {
      return new NextResponse("Missing credentials", { status: 400 });
    }

    const publishedassignment = await db.assignment.update({
      where: {
        id: (await params).assignmentId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedassignment);
  } catch (error) {
    console.log("[ASSIGNMENT_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
