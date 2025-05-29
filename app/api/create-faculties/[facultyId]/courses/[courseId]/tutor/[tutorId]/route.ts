import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: { params: { facultyId: string; courseId: string; tutorId: string } }
) {
  const body = await request.json();
  const { isFree } = body;
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!isFree || isFree.length === 0) {
    return new Response("No data provided", { status: 400 });
  }
  const ownCourse = await db.course.findUnique({
    where: {
      id: params.courseId,
      facultyId: params.facultyId,
      userId,
    },
  });
  if (!ownCourse) {
    return new Response("Course not found", { status: 404 });
  }
  const tutor = await db.tutor.findUnique({
    where: {
      id: params.tutorId,
      courseId: params.courseId,
      userId,
    },
  });
  if (!tutor) {
    return new Response("Tutor not found", { status: 404 });
  }
  await db.tutor.update({
    where: {
      id: tutor.id,
    },
    data: {
      isFree,
    },
  });
  return new Response("Success", { status: 200 });
}

export async function DELETE(
  request: Request,
  {
    params,
  }: { params: { facultyId: string; courseId: string; tutorId: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const topic = await db.tutor.findUnique({
    where: {
      id: params.tutorId,
      courseId: params.courseId,      
      userId,
    },
  });
  if (!topic) {
    return new Response("Topic not found", { status: 404 });
  }
  if (topic.videoUrl) {
    const existingMuxData = await db.muxData.findFirst({
      where: {
        tutorId: topic.id,
      },
    });
    if (existingMuxData) {
      await db.muxData.delete({
        where: {
          id: existingMuxData.id,
        },
      });
    }
  }
  await db.tutor.delete({
    where: {
      id: topic.id,
    },
  });
  const publishedTutors = await db.tutor.findMany({
    where: {
      courseId: params.courseId,
      isPublished: true,
    },
  });
  if (publishedTutors.length === 0) {
    await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: false,
      },
    });
  }
  return new Response("Success", { status: 200 });
}
