import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ facultyId: string; courseId: string; courseCourseNoticeboardId: string }> }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    const { params } = context; // Destructure params from context

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: (await params).courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastCourseNoticeboard = await db.courseNoticeboard.findFirst({
      where: {
        courseId: (await params).courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastCourseNoticeboard ? (lastCourseNoticeboard.position ?? 0) + 1 : 1;

    const courseNoticeboard = await db.courseNoticeboard.create({
      data: {
        title,
        courseId: (await params).courseId,
        position: newPosition,
        userId,
      },
    });

    return NextResponse.json(courseNoticeboard);
  } catch (error) {
    console.log("[COURSE_NOTICEBOARDS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}