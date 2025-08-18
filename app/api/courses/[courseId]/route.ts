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

    const course = await db.course.findFirst({
      where: { id: courseId, userId },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        isPublished: true,
        tutors: {
          select: {
            id: true,
            title: true,
            description: true,
            videoUrl: true,
            isPublished: true,
          },
          orderBy: { title: "asc" },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found or unauthorized" },
        { status: 404 }
      );
    }

    console.log(
      `[${new Date().toISOString()} GET /api/courses/${courseId}] Course fetched:`,
      course
    );

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} GET /api/courses/${
        (await params).courseId
      }] Error:`,
      error
    );
    return NextResponse.json(
      { success: false, message: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
