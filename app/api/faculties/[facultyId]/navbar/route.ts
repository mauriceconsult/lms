import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { facultyId } = await params;

    const faculties = await db.faculty.findMany({
      where: { userId, isPublished: true },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });

    const courses = await db.course.findMany({
      where: { facultyId, userId, isPublished: true },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });

    const tutors = await db.tutor.findMany({
      where: { facultyId, userId, isPublished: true },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: { faculties, courses, tutors },
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} GET /api/faculties/${
        (await params).facultyId
      }/navbar] Error:`,
      error
    );
    return NextResponse.json(
      { success: false, message: "Failed to fetch navbar data" },
      { status: 500 }
    );
  }
}
