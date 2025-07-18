import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ facultyId: string; courseworkId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownFaculty = await db.faculty.findUnique({
      where: {
        id: (await params).facultyId,
        userId,
      },
    });
    if (!ownFaculty) {
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
        facultyId: (await params).facultyId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedCourseworks = await db.coursework.findMany({
      where: {
        id: (await params).courseworkId,
        facultyId: (await params).facultyId,
        isPublished: true,
      },
    });
    if (!publishedCourseworks.length) {
      await db.faculty.update({
        where: {
          id: (await params).facultyId,
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
