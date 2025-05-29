import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { facultyId: string; courseId: string; tutorId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCourse = await db.course.findUnique({
      where: { 
        id: params.courseId,
        userId,
      }
    });
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const topic = await db.tutor.findUnique({
      where: {
        id: params.tutorId,
        courseId: params.courseId,
      }
    });
    const muxData = await db.muxData.findUnique({
      where: {
        tutorId: params.tutorId
      }
    });
    if (!topic || !topic.description || !muxData || !topic.title || !topic.objective || !topic.videoUrl) {
      return new NextResponse("Missing credentials", { status: 400 });
    }
    const publishedTopic = await db.tutor.update({
      where: {
        id: params.tutorId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      }
    });
    return NextResponse.json(publishedTopic)
  } catch (error) {
    console.log("[TUTOR_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

