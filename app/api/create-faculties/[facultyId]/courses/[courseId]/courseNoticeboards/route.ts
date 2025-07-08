import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      facultyId: string;
      courseId: string;     
    };
  }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const facultyOwner = await db.faculty.findUnique({
      where: {
        id: params.facultyId,
        userId,
      },
    });

    if (!facultyOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const lastCourseNotice = await db.courseNoticeboard.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastCourseNotice
      ? (lastCourseNotice.position ?? 0) + 1
      : 1;

    const courseNoticeboard = await db.courseNoticeboard.create({
      data: {
        title,
        courseId: params.courseId,
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
