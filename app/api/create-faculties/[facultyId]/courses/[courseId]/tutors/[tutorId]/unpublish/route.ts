import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string; tutorId: string; }> }
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
    const ownTutor = await db.tutor.findUnique({
      where: {
        id: (await params).tutorId,
        userId,
      },
    });
    if (!ownTutor) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedTutor = await db.tutor.update({
      where: {
        id: (await params).tutorId,
        courseId: (await params).courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedTutors = await db.tutor.findMany({
      where: {
        id: (await params).tutorId,
        courseId: (await params).courseId,
        isPublished: true,
      },
    });
    if (!publishedTutors.length) {
      await db.course.update({
        where: {
          id: (await params).courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(unpublishedTutor);
  } catch (error) {
    console.log("[TUTOR_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
