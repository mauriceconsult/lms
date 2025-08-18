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

    const noticeboards = await db.noticeboard.findMany({
      where: { facultyId, userId, isPublished: true },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: noticeboards,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} GET /api/faculties/${
        (await params).facultyId
      }/noticeboards] Error:`,
      error
    );
    return NextResponse.json(
      { success: false, message: "Failed to fetch noticeboards" },
      { status: 500 }
    );
  }
}
