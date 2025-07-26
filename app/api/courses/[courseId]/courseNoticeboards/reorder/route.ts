import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface ReorderRequestBody {
  list: { id: string; position: number }[];
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const courseId = (await params).courseId;
    if (!courseId) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Course ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let body: ReorderRequestBody;
    try {
      body = await req.json();
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid JSON body", error }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { list } = body;
    if (
      !Array.isArray(list) ||
      !list.every(
        (item) =>
          typeof item.id === "string" && typeof item.position === "number"
      )
    ) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message:
            "Invalid request body: list must be an array of { id: string; position: number }",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Unauthorized: Course not found or user not authorized",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify all courseNoticeboard IDs belong to the course
    const courseNoticeboardIds = list.map((item) => item.id);
    const validCourseNoticeboards = await db.courseNoticeboard.findMany({
      where: {
        id: { in: courseNoticeboardIds },
        courseId,
      },
      select: { id: true },
    });

    if (validCourseNoticeboards.length !== list.length) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid course Noticeboard IDs: Some IDs do not belong to this course",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update positions
    for (const item of list) {
      await db.courseNoticeboard.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Course Notices reordered successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error", error }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
