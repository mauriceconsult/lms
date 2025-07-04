import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { facultyId: string; courseId: string; tuitionId: string } }
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
    const tuition = await db.tuition.findUnique({
      where: {
        id: params.tuitionId,
        courseId: params.courseId,
        userId,
      },
    });
    if (!tuition) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedTuition = await db.tuition.delete({
      where: {
        id: params.tuitionId,
      },
    });
    return NextResponse.json(deletedTuition);
  } catch (error) {
    console.log("TUITION_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { facultyId: string; courseId: string; tuitionId: string } }
) {
  try {
    const { userId } = await auth();
    const { facultyId, courseId, tuitionId } = params;
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
    const tuition = await db.tuition.update({
      where: {
        id: tuitionId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(tuition);
  } catch (error) {
    console.log("TUITION_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
