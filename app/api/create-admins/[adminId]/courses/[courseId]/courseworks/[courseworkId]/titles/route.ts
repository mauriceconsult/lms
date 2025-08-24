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
      courseworkId: string;
    }>;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const course = await db.course.findUnique({
      where: {
        id: (await params).courseId,
        userId: userId,
      },
    });
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }
    const coursework = await db.coursework.findUnique({
      where: {
        id: (await params).courseworkId,
        courseId: (await params).courseId,
        userId,
      },
    });
    if (!coursework) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedCourseNotice = await db.coursework.delete({
      where: {
        id: (await params).courseworkId,
      },
    });
    return NextResponse.json(deletedCourseNotice);
  } catch (error) {
    console.log("[COURSEWORK_ID_DELETE]", error);
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
      courseworkId: string;
    }>;
  }
) {
  try {
    const { userId } = await auth();
    const { adminId, courseId, courseworkId } = await params;
    const values = await req.json();

    console.log("PATCH Params:", { adminId, courseId, courseworkId });
    console.log("Request body:", values);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!courseworkId) {
      return new NextResponse("Invalid coursework ID", { status: 400 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const coursework = await db.coursework.findUnique({
      where: {
        id: courseworkId,
      },
    });
    if (!coursework) {
      return new NextResponse("Coursework not found", { status: 404 });
    }

    const updatedCoursework = await db.coursework.update({
      where: {
        id: courseworkId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(updatedCoursework);
  } catch (error) {
    console.log("[COURSEWORK_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
