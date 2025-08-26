import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      adminId: string;
      courseId: string;
      courseCoursenoticeboardId: string;
    }>;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCoursenoticeboard = await db.courseNoticeboard.findUnique({
      where: {
        id: (await params).courseCoursenoticeboardId,
        userId,
      },
    });
    if (!ownCoursenoticeboard) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const unpublishedCoursenoticeboard = await db.courseNoticeboard.update({
      where: {
        id: (await params).courseCoursenoticeboardId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedCoursenoticeboard = await db.courseNoticeboard.findMany({
      where: {
        id: (await params).courseCoursenoticeboardId,
        isPublished: true,
      },
    });
    if (!publishedCoursenoticeboard.length) {
      await db.courseNoticeboard.update({
        where: {
          id: (await params).courseCoursenoticeboardId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(unpublishedCoursenoticeboard);
  } catch (error) {
    console.log("[COURSE_NOTICEBOARD_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
