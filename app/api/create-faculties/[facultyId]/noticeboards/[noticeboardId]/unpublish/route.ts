import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { facultyId: string; noticeboardId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownFaculty = await db.faculty.findUnique({
      where: {
        id: params.facultyId,
        userId,
      },
    });
    if (!ownFaculty) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedNoticeboard = await db.noticeboard.update({
      where: {
        id: params.noticeboardId,
        facultyId: params.facultyId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedNoticeboards = await db.noticeboard.findMany({
      where: {
        id: params.noticeboardId,
        facultyId: params.facultyId,
        isPublished: true,
      },
    });
    if (!publishedNoticeboards.length) {
      await db.faculty.update({
        where: {
          id: params.facultyId,
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
