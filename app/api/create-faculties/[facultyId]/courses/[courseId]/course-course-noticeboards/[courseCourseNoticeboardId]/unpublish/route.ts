import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      facultyId: string;
      courseId: string;
      courseCourseNoticeboardId: string;
    }>;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCourseNoticeboard = await db.courseNoticeboard.findUnique({
      where: {
        id: (await params).courseCourseNoticeboardId,
        userId,
      },
    });
    if (!ownCourseNoticeboard) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const unpublishedCourseNoticeboard = await db.courseNoticeboard.update({
      where: {
        id: (await params).courseCourseNoticeboardId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedCourseNoticeboard = await db.courseNoticeboard.findMany({
      where: {
        id: (await params).courseCourseNoticeboardId,
        isPublished: true,
      },
    });
    if (!publishedCourseNoticeboard.length) {
      await db.courseNoticeboard.update({
        where: {
          id: (await params).courseCourseNoticeboardId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(unpublishedCourseNoticeboard);
  } catch (error) {
    console.log("[COURSE_NOTICEBOARD_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
