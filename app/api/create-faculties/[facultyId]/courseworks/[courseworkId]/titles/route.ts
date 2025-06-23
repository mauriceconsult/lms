import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { facultyId: string; courseworkId: string; } }
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
    const coursework = await db.coursework.findUnique({
      where: {
        id: params.courseworkId,
        userId: userId,
      },
    });
    if (!coursework) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedCoursework = await db.coursework.delete({
      where: {
        id: params.courseworkId,
      },
    });
    return NextResponse.json(deletedCoursework);
  } catch (error) {
    console.log("[COURSEWORK_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { facultyId: string; courseworkId: string; } }
) {
  try {
    const { userId } = await auth();
    const { facultyId, courseworkId } = params;
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
    const coursework = await db.coursework.update({
      where: {
        id: courseworkId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(coursework);
  } catch (error) {
    console.log("[COURSEWORK_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
