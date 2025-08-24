import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
          params: Promise<{ adminId: string; courseId: string; tutorialId: string; assignmentId: string; }>;
  }
) {
  try {
    const { userId } = await auth();
    const { courseId, tutorialId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {...values} = await req.json(); 
   
  
    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      }
    })

    if (!ownCourse) {
      return new NextResponse("Course not found or unauthorized", { status: 401 });
    }
    const tutorial = await db.tutor.update({
      where: {
        id: tutorialId,    
        courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    {/*handle video upload */}

    return NextResponse.json(tutorial);
  } catch (error) {
    console.error("[TUTORIAL_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
