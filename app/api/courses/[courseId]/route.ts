// app/api/faculties/[facultyId]/courses/[courseId]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string }> }
) {
  try {
    const { facultyId, courseId } = await params;
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        facultyId,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        amount: true,
        facultyId: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("[COURSE_FETCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
