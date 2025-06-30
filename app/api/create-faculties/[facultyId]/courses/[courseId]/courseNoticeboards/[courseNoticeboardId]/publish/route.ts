import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: {
      facultyId: string;
      courseId: string;
      courseNoticeboardId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownFaculty = await db.faculty.findUnique({
      where: {
        id: params.facultyId,
        userId,
      },
    });
    if (!ownFaculty) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseNoticeboard = await db.courseNoticeboard.findUnique({
      where: {
        id: params.courseNoticeboardId,
        courseId: params.courseId,
      },
    });

    if (
      !courseNoticeboard ||
      !courseNoticeboard.description ||
      !courseNoticeboard.title
    ) {
      return new NextResponse("Missing credentials", { status: 400 });
    }
    const publishedCourseNotice = await db.courseNoticeboard.update({
      where: {
        id: params.courseNoticeboardId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedCourseNotice);
  } catch (error) {
    console.log("[COURSE_NOTICEBOARD_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
