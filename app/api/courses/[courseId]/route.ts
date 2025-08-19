// app/api/courses/[courseId]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    console.log(
      `[${new Date().toISOString()} CourseAPI] Fetching course: ${courseId}`
    );
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        isPublished: true,
        facultyId: true,
        amount: true,
        tutors: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            description: true,
            videoUrl: true,
            isPublished: true,
            position: true,
          },
          orderBy: { position: "asc" },
        },
      },
    });

    console.log(`[${new Date().toISOString()} CourseAPI] Course data:`, course);
    if (!course) {
      console.error(
        `[${new Date().toISOString()} CourseAPI] Course not found: ${courseId}`
      );
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // Ensure amount is a valid string
    const courseWithStringAmount = {
      ...course,
      amount: course.amount ? String(course.amount) : null,
    };

    if (
      !courseWithStringAmount.amount ||
      Number(courseWithStringAmount.amount) <= 0
    ) {
      console.error(
        `[${new Date().toISOString()} CourseAPI] Invalid amount: ${
          courseWithStringAmount.amount
        }`
      );
      return NextResponse.json(
        {
          success: false,
          message: `Course amount is invalid or missing: ${courseWithStringAmount.amount}`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: courseWithStringAmount },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[${new Date().toISOString()} COURSE_FETCH_ERROR]`, error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
