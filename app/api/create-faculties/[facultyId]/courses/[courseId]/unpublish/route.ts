import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string }> }
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

    const ownCourse = await db.course.findUnique({
      where: {
        id: (await params).courseId,
        userId,
      },
    });
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: (await params).courseId,
        facultyId: (await params).facultyId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedCourses = await db.course.findMany({
      where: {
        id: (await params).courseId,
        facultyId: (await params).facultyId,
        isPublished: true,
      },
    });
    if (!publishedCourses.length) {
      await db.faculty.update({
        where: {
          id: (await params).facultyId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log("[COURSE_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
