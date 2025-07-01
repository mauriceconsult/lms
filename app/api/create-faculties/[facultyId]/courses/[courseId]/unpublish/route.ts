import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { facultyId: string; courseId: string } }
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

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        facultyId: params.facultyId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedCourses = await db.course.findMany({
      where: {
        id: params.courseId,
        facultyId: params.facultyId,
        isPublished: true,
      },
    });
    if (!publishedCourses.length) {
      await db.faculty.update({
        where: {
          id: params.facultyId,
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
