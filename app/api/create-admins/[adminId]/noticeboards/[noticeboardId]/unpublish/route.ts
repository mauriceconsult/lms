import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ adminId: string; noticeboardId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownFaculty = await db.admin.findUnique({
      where: {
        id: (await params).adminId,
        userId,
      },
    });
    if (!ownFaculty) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownNotice = await db.noticeboard.findUnique({
      where: {
        id: (await params).noticeboardId,
        userId,
      },
    });
    if (!ownNotice) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedNoticeboard = await db.noticeboard.update({
      where: {
        id: (await params).noticeboardId,
        adminId: (await params).adminId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedNoticeboards = await db.noticeboard.findMany({
      where: {
        id: (await params).noticeboardId,
        adminId: (await params).adminId,
        isPublished: true,
      },
    });
    if (!publishedNoticeboards.length) {
      await db.admin.update({
        where: {
          id: (await params).adminId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(unpublishedNoticeboard);
  } catch (error) {
    console.log("[NOTICEBOARD_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
