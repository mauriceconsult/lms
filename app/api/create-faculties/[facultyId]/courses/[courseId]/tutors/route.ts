import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {
    params,
  }: { params: Promise<{ facultyId: string; courseId: string; }> }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const facultyOwner = await db.faculty.findUnique({
      where: {
        id: (await params).facultyId,
        userId,
      },
    });

    if (!facultyOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: (await params).courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    } 
    const lastTopic = await db.tutor.findFirst({
      where: {
        courseId: (await params).courseId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastTopic ? (lastTopic.position ?? 0) + 1 : 1;

    const tutor = await db.tutor.create({
      data: {
        title,
        courseId: (await params).courseId,
        position: newPosition,
        userId,
      },
    });

    return NextResponse.json(tutor);
  } catch (error) {
    console.log("[TOPICS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
