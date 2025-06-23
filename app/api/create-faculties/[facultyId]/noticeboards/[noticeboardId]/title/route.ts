import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { facultyId: string; noticeboardId: string; } }
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
    const noticeboard = await db.noticeboard.findUnique({
      where: {
        id: params.noticeboardId,
        userId: userId,
      },
    });
    if (!noticeboard) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedNoticeboard = await db.noticeboard.delete({
      where: {
        id: params.noticeboardId,
      },
    });
    return NextResponse.json(deletedNoticeboard);
  } catch (error) {
    console.log("[NOTICEBOARD_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { facultyId: string; noticeboardId: string; } }
) {
  try {
    const { userId } = await auth();
    const { facultyId, noticeboardId } = params;
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
    const noticeboard = await db.noticeboard.update({
      where: {
        id: noticeboardId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(noticeboard);
  } catch (error) {
    console.log("[FACULTY_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
