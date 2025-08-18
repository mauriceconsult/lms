import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tutorId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { tutorId } = await params;
    const { isCompleted } = await req.json();

    await db.userProgress.upsert({
      where: { userId_tutorId: { userId, tutorId } },
      update: { isCompleted },
      create: { userId, tutorId, isCompleted, courseId: "" }, // courseId set in payment
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} POST /api/tutors/${(await params).tutorId}/progress] Error:`,
      error
    );
    return NextResponse.json(
      { success: false, message: "Failed to update progress" },
      { status: 500 }
    );
  }
}