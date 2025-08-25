import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ adminId: string; noticeboardId: string; }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const admin = await db.admin.findUnique({
      where: {
        id: (await params).adminId,
        userId: userId,
      },
    });
    if (!admin) {
      return new NextResponse("Not found", { status: 404 });
    }
    const noticeboard = await db.noticeboard.findUnique({
      where: {
        id: (await params).noticeboardId,
        userId: userId,
      },
    });
    if (!noticeboard) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedNoticeboard = await db.noticeboard.delete({
      where: {
        id: (await params).noticeboardId,
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
  { params }: { params: Promise<{ adminId: string; noticeboardId: string; }> }
) {
  try {
    const { userId } = await auth();
    const { adminId, noticeboardId } = await params;
    const values = await req.json();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const admin = await db.admin.findUnique({
      where: {
        id: adminId,
        userId,
      },
    });
    if (!admin) {
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
    console.log("[ADMIN_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
