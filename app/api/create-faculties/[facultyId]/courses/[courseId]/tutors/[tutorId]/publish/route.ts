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
      tutorId: string;
    }>;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tutor = await db.tutor.findUnique({
      where: {
        id: (await params).tutorId,
        courseId: (await params).courseId,
      },
    });

    if (
      !tutor ||
      !tutor.description ||
      !tutor.title ||
      !tutor.videoUrl ||
      !tutor.description ||
      !tutor.courseId
    ) {
      return new NextResponse("Missing credentials", { status: 400 });
    }
    const publishedTutor = await db.tutor.update({
      where: {
        id: (await params).tutorId,
        courseId: (await params).courseId,
        // tutorId: (await params).tutorId
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedTutor);
  } catch (error) {
    console.log("[TUTOR_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
