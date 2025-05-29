import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { facultyId: string; courseId: string; tutorId: string } }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const tutor = await db.tutor.findUnique({
      where: {
        id: params.tutorId,
        userId
      }
    });
    if (!tutor) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const tutorOwner = db.tutor.findUnique({
      where: {
        id: params.tutorId,
        userId: userId,
      },
    });
    if (!tutorOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const lastTopic = await db.tutor.findFirst({
      where: {
        id: params.tutorId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastTopic ? (lastTopic.position ?? 0) + 1 : 1;
    const topic = await db.tutor.create({
      data: {
        title,
        position: newPosition,
        userId, 
      },
    });
    return NextResponse.json(topic);
  } catch (error) {
    console.log("[TUTOR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
