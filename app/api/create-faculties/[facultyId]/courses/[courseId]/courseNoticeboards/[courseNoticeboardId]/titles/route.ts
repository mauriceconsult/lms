import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { facultyId: string; courseId: string; courseNoticeboardId: string; } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const faculty = await db.faculty.findUnique({
      where: {
        id: params.facultyId,
        userId: userId,
      },
    });
    if (!faculty) {
      return new NextResponse("Not found", { status: 404 });
    }
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }
    const courseNoticeboard = await db.courseNoticeboard.findUnique({
      where: {
        id: params.courseNoticeboardId,
        courseId: params.courseId,
        userId,
      },
    });
    if (!courseNoticeboard) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedCourseNotice = await db.courseNoticeboard.delete({
      where: {
        id: params.courseNoticeboardId,
      },
    });
    return NextResponse.json(deletedCourseNotice);
  } catch (error) {
    console.log("[COURSE_NOTICEBOARD_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { facultyId: string; courseId: string; courseNoticeboardId: string; } }
) {
  try {
    const { userId } = await auth();
    const { facultyId, courseId, courseNoticeboardId } = params;
    const values = await req.json();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const faculty = await db.faculty.findUnique({
      where: {
        id: facultyId,
        userId,
      },
    });
    if (!faculty) {
      return new NextResponse("Not found", { status: 404 });
    }
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }
    const courseNoticeboard = await db.courseNoticeboard.update({
      where: {
        id: courseNoticeboardId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(courseNoticeboard);
  } catch (error) {
    console.log("[COURSE_NOTICEBOARD_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
