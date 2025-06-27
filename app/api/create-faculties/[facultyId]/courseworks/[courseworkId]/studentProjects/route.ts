import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { facultyId: string; courseworkId: string; studentProjectId: string; } }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseworkOwner = await db.coursework.findUnique({
      where: {
        id: params.courseworkId,
        userId,
      },
    });
    
    if (!courseworkOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const lastStudentProject = await db.studentProject.findFirst({
      where: {
        courseworkId: params.courseworkId,
      },
      orderBy: {
        position: "desc"
      }
    });
    const newPosition = lastStudentProject ? ((lastStudentProject.position ?? 0) + 1) : 1;

    const studentProject = await db.studentProject.create({   
      data: {
        title,
        courseworkId: params.courseworkId,
        position: newPosition,
        userId,
      },
    });

    return NextResponse.json(studentProject);
  } catch (error) {
    console.log("[STUDENT_PROJECTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}





