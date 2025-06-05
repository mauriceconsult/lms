import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { noticeId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const notice = await db.noticeBoard.findUnique({
      where: {
        id: params.noticeId,
        userId: userId,
      },
    });
    if (!notice) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedNotice = await db.noticeBoard.delete({
      where: {
        id: params.noticeId,
      },
    });
    return NextResponse.json(deletedNotice);
  } catch (error) {
    console.log("[NOTICE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { noticeId: string }}
) {
  try {
    const { userId } = await auth();
    const { noticeId } = params;
    const values = await req.json();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const notice = await db.noticeBoard.update({
      where: {
        id: noticeId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(notice);
  } catch (error) {
    console.log("[NOTICE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
