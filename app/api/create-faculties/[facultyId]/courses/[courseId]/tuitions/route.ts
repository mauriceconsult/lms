import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { facultyId: string; courseId: string; } }
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
    const lastTuition = await db.tuition.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc"
      }
    });
    const newPosition = lastTuition ? ((lastTuition.position ?? 0) + 1) : 1;

    const tuition = await db.tuition.create({   
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
        userId,
      },
    });

    return NextResponse.json(tuition);
  } catch (error) {
    console.log("[TUITIONS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}





