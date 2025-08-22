import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { courseId } = params;

  const enrollment = await db.userProgress.findFirst({
    where: { userId, courseId, isEnrolled: true },
    select: { isEnrolled: true },
  });

  return NextResponse.json({ isEnrolled: !!enrollment });
};