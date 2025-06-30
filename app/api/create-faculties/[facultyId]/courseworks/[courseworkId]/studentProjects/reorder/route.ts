import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: {
      facultyId: string;
      courseworkId: string;
      studentProjectId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { list } = await req.json();
    const facultyOwner = db.faculty.findUnique({
      where: {
        id: params.facultyId,
        userId: userId,
      },
    });
    if (!facultyOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseworkOwner = db.coursework.findUnique({
      where: {
        id: params.courseworkId,
        userId: userId,
      },
    });
    if (!courseworkOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const studentProjectOwner = db.studentProject.findUnique({
      where: {
        id: params.studentProjectId,
        userId: userId,
      },
    });
    if (!studentProjectOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    for (const item of list) {
      await db.studentProject.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }
    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[STUDENT_PROJECT_REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
