import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const course = await db.course.findUnique({
      where: { id: (await params).courseId },
      include: {
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
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...course,
        imageUrl:
          course.imageUrl && course.imageUrl !== "" ? course.imageUrl : null,
        tutors: course.tutors.map((tutor) => ({
          ...tutor,
          videoUrl:
            tutor.videoUrl && tutor.videoUrl !== "" ? tutor.videoUrl : null,
        })),
      },
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} API] Error fetching course:`,
      error
    );
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
