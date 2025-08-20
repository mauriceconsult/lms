import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId } = await params;
    const enrollment = await db.userProgress.findFirst({
      where: {
        userId,
        courseId,
        isEnrolled: true,
      },
      select: {
        id: true,
        courseId: true,
        isEnrolled: true,
        isCompleted: true,
      },
    });

    console.log(`[${new Date().toISOString()} EnrollmentAPI] Response:`, {
      userId,
      courseId,
      enrolled: !!enrollment,
    });

    return NextResponse.json({
      success: true,
      data: enrollment || null,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()} EnrollmentAPI] Error:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId } = await params;
    const { isEnrolled } = await req.json();

    // Fetch a tutor for the course
    const firstTutor = await db.tutor.findFirst({
      where: { courseId, isPublished: true },
      select: { id: true },
      orderBy: { position: "asc" },
    });

    if (!firstTutor) {
      return NextResponse.json(
        { success: false, message: "No tutors available for this course" },
        { status: 400 }
      );
    }

    // Fetch a coursework and assignment (if any)
    const firstCoursework = await db.coursework.findFirst({
      where: { courseId },
      select: { id: true },
    });

    const firstAssignment = await db.assignment.findFirst({
      where: { tutorId: firstTutor.id },
      select: { id: true },
    });

    const enrollment = await db.userProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: { isEnrolled },
      create: {
        userId,
        courseId,
        tutorId: firstTutor.id,
        courseworkId: firstCoursework?.id || null,
        assignmentId: firstAssignment?.id || null,
        isEnrolled,
        isCompleted: false,
      },
      select: {
        id: true,
        courseId: true,
        isEnrolled: true,
        isCompleted: true,
      },
    });

    console.log(
      `[${new Date().toISOString()} EnrollmentAPI] Created/Updated:`,
      {
        userId,
        courseId,
        tutorId: firstTutor.id,
        isEnrolled,
      }
    );

    return NextResponse.json({ success: true, data: enrollment });
  } catch (error) {
    console.error(`[${new Date().toISOString()} EnrollmentAPI] Error:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
