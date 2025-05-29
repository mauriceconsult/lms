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
    const ownTopic = await db.tutor.findUnique({
      where: {
        id: params.tutorId,
        userId,
      },
    });
    if (!ownTopic) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedTopic = await db.tutor.update({
      where: {
        id: params.tutorId,
        courseId: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });
    const publishedTopics = await db.tutor.findMany({
      where: {
        id: params.tutorId,
        courseId: params.courseId,
        isPublished: true,
      },
    });
    if (!publishedTopics.length) {
      await db.tutor.update({
        where: {
          id: params.tutorId,
        },
        data: {
          isPublished: true,
        },
      });
    }
    return NextResponse.json(unpublishedTopic);
  } catch (error) {
    console.log("[TUTOR_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
