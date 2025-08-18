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

    const { courseId, tutorId } = await params;

    const tutor = await db.tutor.findUnique({
      where: {
        id: tutorId,
        courseId,
        userId,
      },
      include: {
        assignments: {
          where: {
            isPublished: true,
          },
        },
      },
    });

    if (
      !tutor ||
      !tutor.title ||
      !tutor.description ||
      !tutor.videoUrl ||
      !tutor.courseId ||
      tutor.assignments.length === 0
    ) {
      return new NextResponse(
        "Missing required fields or no published assignments",
        { status: 400 }
      );
    }

    const publishedTutor = await db.tutor.update({
      where: {
        id: tutorId,
        courseId,
        userId,
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