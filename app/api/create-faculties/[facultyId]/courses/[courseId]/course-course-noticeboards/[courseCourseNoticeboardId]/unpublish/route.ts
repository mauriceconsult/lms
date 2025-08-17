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
      courseNoticeboardId: string;
    }>;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownFaculty = await db.faculty.findUnique({
      where: {
        id: (await params).facultyId,
        userId,
      },
    });
    if (!ownFaculty) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCourse = await db.course.findUnique({
      where: {
        id: (await params).courseId,
        userId,
      },
    });
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCourseNotice = await db.courseNoticeboard.findUnique({
      where: {
        id: (await params).courseNoticeboardId,
        userId,
      },
    });
    if (!ownCourseNotice) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedCourseNotice = await db.courseNoticeboard.update({
      where: {
        id: (await params).courseNoticeboardId,
        courseId: (await params).courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });
    const publishedCourseNotices = await db.courseNoticeboard.findMany({
      where: {
        id: (await params).courseNoticeboardId,
        courseId: (await params).courseId,
        isPublished: true,
      },
    });
    if (!publishedCourseNotices.length) {
      await db.courseNoticeboard.update({
        where: {
          id: (await params).courseNoticeboardId,
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
