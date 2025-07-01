import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: { params: { facultyId: string; courseId: string; tutorId: string } }
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
    const ownTutor = await db.tutor.findUnique({
      where: {
        id: params.tutorId,
        userId,
      },
    });
    if (!ownTutor) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedTutor = await db.tutor.update({
      where: {
        id: params.tutorId,
        courseId: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });
    const publishedTutors = await db.tutor.findMany({
      where: {
        id: params.tutorId,
        courseId: params.courseId,
        isPublished: true,
      },
    });
    if (!publishedTutors.length) {
      await db.tutor.update({
        where: {
          id: params.tutorId,
        },
        data: {
          isPublished: true,
        },
      });
    }
    return NextResponse.json(unpublishedTutor);
  } catch (error) {
    console.log("[TUTOR_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
