import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId } = await params;
    const { partyId, username } = await req.json();

    if (!partyId.match(/^256\d{7}$/)) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Mock MoMo API call (replace with actual MoMo API integration)
    const momoResponse = await mockMoMoPayment(partyId, courseId);
    if (!momoResponse.success) {
      return NextResponse.json(
        { success: false, message: "Payment failed" },
        { status: 400 }
      );
    }

    // Enroll user in course
    await db.userProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { isEnrolled: true },
      create: { userId, courseId, isEnrolled: true },
    });

    // Update username if provided
    if (username) {
      await db.user.update({
        where: { id: userId },
        data: { username },
      });
    }

    // Get first tutor
    const firstTutor = await db.tutor.findFirst({
      where: { courseId, isPublished: true },
      orderBy: { position: "asc" },
      select: { id: true },
    });

    return NextResponse.json({
      success: true,
      firstTutorId: firstTutor?.id || "",
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} POST /api/courses/${
        (await params).courseId
      }/payment] Error:`,
      error
    );
    return NextResponse.json(
      { success: false, message: "Failed to process payment" },
      { status: 500 }
    );
  }
}

// Mock MoMo API (replace with actual MoMo API call)
async function mockMoMoPayment(partyId: string, courseId: string) {
  // Simulate MoMo payment processing
  return { success: true };
}
