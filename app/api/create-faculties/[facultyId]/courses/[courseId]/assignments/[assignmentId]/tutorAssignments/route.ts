import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { facultyId: string; courseId: string; assignmentId: string; tutorAssignmentId: string; } }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const lastTutorAssignment = await db.tutorAssignment.findFirst({
      where: {
        assignmentId: params.assignmentId,
      },
      orderBy: {
        position: "desc"
      }
    });
    const newPosition = lastTutorAssignment ? ((lastTutorAssignment.position ?? 0) + 1) : 1;

    const tutorAssignment = await db.tutorAssignment.create({   
      data: {
        title,
        assignmentId: params.assignmentId,
        position: newPosition,
        userId,
      },
    });

    return NextResponse.json(tutorAssignment);
  } catch (error) {
    console.log("[TUTOR_ASSIGNMENTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}





