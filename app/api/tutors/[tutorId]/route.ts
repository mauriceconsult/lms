// app/api/tutors/[tutorId]/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ tutorId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { tutorId } = await params;

    const tutor = await db.tutor.findFirst({
      where: { id: tutorId, userId },
      select: {
        id: true,
        title: true,
        description: true,
        videoUrl: true,
        isPublished: true,
        position: true,
        courseId: true,
      },
    });

    if (!tutor) {
      return NextResponse.json(
        { success: false, message: "Tutor not found or unauthorized" },
        { status: 404 }
      );
    }

    const userProgress = await db.userProgress.findFirst({
      where: { userId, tutorId },
      select: { isCompleted: true },
    });

    const nextTutor = await db.tutor.findFirst({
      where: {
        courseId: tutor.courseId,
        isPublished: true,
        position: { gt: tutor.position },
      },
      orderBy: { position: "asc" },
      select: { id: true },
    });

    console.log(
      `[${new Date().toISOString()} GET /api/tutors/${tutorId}] Tutor fetched:`,
      tutor
    );

    return NextResponse.json({
      success: true,
      data: {
        ...tutor,
        isCompleted: userProgress?.isCompleted || false,
        nextTutorId: nextTutor?.id || null,
      },
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} GET /api/tutors/${
        (await params).tutorId
      }] Error:`,
      error
    );
    return NextResponse.json(
      { success: false, message: "Failed to fetch tutor" },
      { status: 500 }
    );
  }
}
