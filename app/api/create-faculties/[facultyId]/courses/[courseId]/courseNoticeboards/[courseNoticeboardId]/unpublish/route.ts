import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: { params: { facultyId: string; courseId: string; courseNoticeboardId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownTopic = await db.courseNoticeboard.findUnique({
      where: {
        id: params.courseNoticeboardId,
        userId,
      },
    });
    if (!ownTopic) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedCourseNotice = await db.courseNoticeboard.update({
      where: {
        id: params.courseNoticeboardId,
        courseId: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });
    const publishedCourseNotices = await db.courseNoticeboard.findMany({
      where: {
        id: params.courseNoticeboardId,
        courseId: params.courseId,
        isPublished: true,
      },
    });
    if (!publishedCourseNotices.length) {
      await db.courseNoticeboard.update({
        where: {
          id: params.courseNoticeboardId,
        },
        data: {
          isPublished: true,
        },
      });
    }
    return NextResponse.json(unpublishedCourseNotice);
  } catch (error) {
    console.log("[COURSE_NOTICE_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
