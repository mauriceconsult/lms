import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      facultyId: string;
      courseId: string;
      courseworkId: string;
    }>;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCoursework = await db.coursework.findUnique({
      where: {
        id: (await params).courseworkId,
        userId,
      },
    });
    if (!ownCoursework) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const unpublishedCoursework = await db.coursework.update({
      where: {
        id: (await params).courseworkId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedCoursework = await db.coursework.findMany({
      where: {
        id: (await params).courseworkId,
        isPublished: true,
      },
    });
    if (!publishedCoursework.length) {
      await db.coursework.update({
        where: {
          id: (await params).courseworkId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(unpublishedCoursework);
  } catch (error) {
    console.log("[COURSEWORK_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
