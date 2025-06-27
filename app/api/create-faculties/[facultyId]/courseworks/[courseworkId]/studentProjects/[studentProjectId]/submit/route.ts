import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { facultyId: string; courseworkId: string; studentProjectId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCoursework = await db.coursework.findUnique({
      where: { 
        id: params.courseworkId,
        userId,
      }
    });
    if (!ownCoursework) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const studentProject = await db.studentProject.findUnique({
      where: {
        id: params.studentProjectId,
        courseworkId: params.courseworkId,
      }
    });
  
    if (!studentProject || !studentProject.description || !studentProject.title || !studentProject.abstract ) {
      return new NextResponse("Missing credentials", { status: 400 });
    }
    const publishedTopic = await db.studentProject.update({
      where: {
        id: params.studentProjectId,
        courseworkId: params.courseworkId,
      },
      data: {
        isSubmitted: true,
      }
    });
    return NextResponse.json(publishedTopic)
  } catch (error) {
    console.log("[STUDENT_PROJECT_SUBMIT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

