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

    const tutors = await db.tutor.findMany({
      where: { courseId, userId, isPublished: true },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: tutors,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} GET /api/courses/${
        (await params).courseId
      }/tutors] Error:`,
      error
    );
    return NextResponse.json(
      { success: false, message: "Failed to fetch tutors" },
      { status: 500 }
    );
  }
}
