import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string; tutorId: string; }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const faculty = await db.faculty.findUnique({
      where: {
        id: (await params).facultyId,
        userId: userId,
      },
    });
    if (!faculty) {
      return new NextResponse("Not found", { status: 404 });
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
    const topic = await db.tutor.findUnique({
      where: {
        id: (await params).tutorId,
        courseId: (await params).courseId,
        userId,
      },
    });
    if (!topic) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedTopic = await db.tutor.delete({
      where: {
        id: (await params).tutorId,
      },
    });
    return NextResponse.json(deletedTopic);
  } catch (error) {
    console.log("[TUTOR_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string; tutorId: string; }> }
) {
  try {
    const { userId } = await auth();
    const { tutorId } = await params;
    const values = await req.json();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }    
    const tutor = await db.tutor.update({
      where: {
        id: tutorId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(tutor);
  } catch (error) {
    console.log("[TUTOR_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
