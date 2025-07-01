import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  {
    params,
  }: { params: { facultyId: string; courseId: string; tutorId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { list } = await req.json();
    const facultyOwner = db.faculty.findUnique({
      where: {
        id: params.facultyId,
        userId: userId,
      },
    });
    if (!facultyOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const tutorOwner = db.tutor.findUnique({
      where: {
        id: params.tutorId,
        userId: userId,
      },
    });
    if (!tutorOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    for (const item of list) {
      await db.tutor.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }
    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[TUTOR_REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
