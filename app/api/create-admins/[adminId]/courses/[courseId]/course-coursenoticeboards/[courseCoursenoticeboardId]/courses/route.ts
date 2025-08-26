import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
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
    const courseNoticeboard = await db.courseNoticeboard.findUnique({
      where: {
        id: (await params).courseCoursenoticeboardId,
        userId: userId,
      },
    });
    if (!courseNoticeboard) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedCoursenoticeboard = await db.courseNoticeboard.delete({
      where: {
        id: (await params).courseCoursenoticeboardId,
      },
    });
    return NextResponse.json(deletedCoursenoticeboard);
  } catch (error) {
    console.log("[COURSE_NOTICEBOARD_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
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
    const { courseCoursenoticeboardId } = await params;
    const values = await req.json();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const courseCourseNoticeboard = await db.courseNoticeboard.update({
      where: {
        id: courseCoursenoticeboardId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(courseCourseNoticeboard);
  } catch (error) {
    console.log("[COURSE_NOTICEBOARD_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
