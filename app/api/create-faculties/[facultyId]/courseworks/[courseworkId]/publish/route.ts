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
      courseworkId: string;
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

    const coursework = await db.coursework.findUnique({
      where: {
        id: (await params).courseworkId,
        facultyId: (await params).facultyId,
      },      
    }); 

    if (
      !coursework
      ||
      !coursework.description
      ||
      !coursework.title     
    ) {
      return new NextResponse("Missing credentials", { status: 400 });
    }   
    const publishedCourse = await db.coursework.update({
      where: {
        id: (await params).courseworkId,
        facultyId: (await params).facultyId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("[COURSEWORK_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
