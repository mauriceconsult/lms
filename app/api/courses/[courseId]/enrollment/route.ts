// app/api/courses/[courseId]/enroll/route.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    if (course.amount != null) {
      return NextResponse.json(
        { success: false, message: "Course requires payment" },
        { status: 400 }
      );
    }

    const enrollment = await db.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: {
        userId,
        courseId,
      },
    });

    return NextResponse.json({ success: true, data: enrollment });
  } catch (error) {
    console.error(`[${new Date().toISOString()} API] Enrollment error:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
