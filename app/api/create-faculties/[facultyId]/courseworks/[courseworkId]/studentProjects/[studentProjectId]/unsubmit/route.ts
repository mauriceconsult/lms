import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: { params: { facultyId: string; courseworkId: string; studentProjectId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCoursework = await db.coursework.findUnique({
      where: {
        id: params.courseworkId,
        userId,
      },
    });
    if (!ownCoursework) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedStudentProject = await db.studentProject.update({
      where: {
        id: params.studentProjectId,
        courseworkId: params.courseworkId,
        userId,
      },
      data: {
        isSubmitted: true,
      },
    });
    const publishedStudentProjects = await db.studentProject.findMany({
      where: {
        id: params.studentProjectId,
        courseworkId: params.courseworkId,
        isSubmitted: true,
      },
    });
    if (!publishedStudentProjects.length) {
      await db.studentProject.update({
        where: {
          id: params.studentProjectId,
        },
        data: {
          isSubmitted: true,
        },
      });
    }
    return NextResponse.json(unpublishedStudentProject);
  } catch (error) {
    console.log("[STUDENT_PROJECT_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
