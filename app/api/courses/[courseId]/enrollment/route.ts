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
      where: { userId, courseId },
    });

    return NextResponse.json({
      success: true,
      isEnrolled: !!enrollment,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} GET /api/courses/${
        (await params).courseId
      }/enrollment] Error:`,
      error
    );
    return NextResponse.json(
      { success: false, message: "Failed to check enrollment" },
      { status: 500 }
    );
  }
}
