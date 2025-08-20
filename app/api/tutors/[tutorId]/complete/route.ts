"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tutorId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} CompleteAPI] Unauthorized: No userId`
    );
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { tutorId } = await params;
  try {
    const updated = await db.userProgress.updateMany({
      where: { userId, tutorId, isEnrolled: true },
      data: { isCompleted: true },
    });

    if (updated.count === 0) {
      console.log(
        `[${new Date().toISOString()} CompleteAPI] No enrollment found for tutorId: ${tutorId}, userId: ${userId}`
      );
      return new NextResponse("No enrollment found", { status: 404 });
    }

    console.log(
      `[${new Date().toISOString()} CompleteAPI] Tutorial marked as completed`,
      { tutorId, userId }
    );
    return new NextResponse("Tutorial marked as completed", { status: 200 });
  } catch (error) {
    console.error(`[${new Date().toISOString()} CompleteAPI] Error:`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
