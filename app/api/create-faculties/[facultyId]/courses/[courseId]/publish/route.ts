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
    }>
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const faculty = await db.faculty.findUnique({
      where: {
        id: (await params).facultyId,
        userId,
      },
    });
    if (!faculty) {
      return new NextResponse("Not found", { status: 404 });
    } 

    const course = await db.course.findUnique({
      where: {
        id: (await params).courseId,
        facultyId: (await params).facultyId,
      },
      include: {
        tutors: true,
      },
    });
    const hasPublishedTopic = course?.tutors?.some((tutor) => tutor.isPublished);

    if (
      !course
      ||
      !course.description
      ||
      !course.title
      ||
      !course.imageUrl
      ||
      !
      course.amount
      ||
      !hasPublishedTopic
    ) {
      return new NextResponse("Missing credentials", { status: 400 });
    }   
    const publishedCourse = await db.course.update({
      where: {
        id: (await params).courseId,
        facultyId: (await params).facultyId,
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
