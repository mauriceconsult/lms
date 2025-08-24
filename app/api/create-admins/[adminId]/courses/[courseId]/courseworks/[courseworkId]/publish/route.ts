import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      adminId: string;
      courseId: string;
      courseworkId: string;
    }>;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCoursework = await db.coursework.findUnique({
      where: {
        id: (await params).courseworkId,
        userId,
      },
    });
    if (!ownCoursework) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const coursework = await db.coursework.findUnique({
      where: {
        id: (await params).courseworkId,
        userId,
      },     
    });

    if (
      !coursework ||
      !coursework.description ||
      !coursework.title ||
      !coursework.courseId
   
    ) {
      return new NextResponse("Missing credentials", { status: 400 });
    }

    const publishedcoursework = await db.coursework.update({
      where: {
        id: (await params).courseworkId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedcoursework);
  } catch (error) {
    console.log("[COURSEWORK_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
