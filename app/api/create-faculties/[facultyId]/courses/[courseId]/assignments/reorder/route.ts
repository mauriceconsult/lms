import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  {
    params,
  }: { params: Promise<{ facultyId: string; courseId: string; assignmentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { list } = await req.json();
    const facultyOwner = db.faculty.findUnique({
      where: {
        id: (await params).facultyId,
        userId: userId,
      },
    });
    if (!facultyOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = db.course.findUnique({
      where: {
        id: (await params).courseId,
        userId: userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const assignmentOwner = db.assignment.findUnique({
      where: {
        id: (await params).assignmentId,
        userId: userId,
      },
    });
    if (!assignmentOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    for (const item of list) {
      await db.assignment.update({
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
    console.log("[ASSIGNMENT_REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
