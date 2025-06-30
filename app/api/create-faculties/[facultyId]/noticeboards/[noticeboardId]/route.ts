import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { facultyId: string; noticeboardId: string } }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const noticeboardOwner = db.noticeboard.findUnique({
      where: {
        id: params.noticeboardId,
        userId: userId,
      },
    });
    if (!noticeboardOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const lastNoticeboard = await db.noticeboard.findFirst({
      where: {
        id: params.noticeboardId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastNoticeboard
      ? (lastNoticeboard.position ?? 0) + 1
      : 1;
    const noticeboard = await db.noticeboard.create({
      data: {
        title,
        id: params.noticeboardId,
        position: newPosition,
        userId,
      },
    });

    return NextResponse.json(noticeboard);
  } catch (error) {
    console.log("[NOTICEBOARD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { facultyId: string; noticeboardId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const facultyOwner = db.faculty.findUnique({
      where: {
        id: params.facultyId,
        userId: userId,
      },
    });
    if (!facultyOwner) {
      return new NextResponse("Not found", { status: 404 });
    }
    const noticeboardOwner = db.noticeboard.findUnique({
      where: {
        id: params.noticeboardId,
        userId: userId,
      },
    });
    if (!noticeboardOwner) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedFaculty = await db.faculty.delete({
      where: {
        id: params.facultyId,
        userId: userId,
      },
    });
    return NextResponse.json(deletedFaculty);
  } catch (error) {
    console.log("[NOTICEBOARD_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
