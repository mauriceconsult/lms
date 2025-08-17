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
    }>;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
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
    const course = await db.course.findUnique({
      where: {
        id: (await params).courseId,
        userId,
      },
      include: {
        courseNoticeboards: true,
        tutors: true,
        tuitions: true,
      },
    });

    const hasPublishedTutor = course?.tutors.some(
      (tutor) => tutor.isPublished
    );
    if (
      !course ||
      !course.title ||
      !course.description ||
      !course.facultyId ||
      !course.imageUrl ||
      !course.amount ||
      !hasPublishedTutor
    ) {
      return new NextResponse("Missing credentials", { status: 400 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: (await params).courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("[COURSE_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
