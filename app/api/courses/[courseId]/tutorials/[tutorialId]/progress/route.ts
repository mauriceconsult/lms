import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string; tutorialId: string; }> }
) {
  try {
    const { userId } = await auth();
    const { isCompleted } = await req.json();
    if (!userId) {
      return redirect("/");
    }
    const userProgress = await db.userProgress.upsert({
      where: {
        userId_tutorId: {
          userId,
          tutorId: (await params).tutorialId
        }  
      },
      update: {
        isCompleted
      },
      create: {
        userId,
        tutorId: (await params).tutorialId,
        isCompleted,
      }
    })
    return NextResponse.json(userProgress)
  } catch (error) {
    console.log("[TUTORIAL_ID_PROGRESS]", error);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}