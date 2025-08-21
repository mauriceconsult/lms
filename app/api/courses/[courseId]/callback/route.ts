import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const { userId, paymentStatus, transactionId } = await req.json();

  if (paymentStatus !== "success") {
    return NextResponse.json(
      { success: false, message: "Payment failed" },
      { status: 400 }
    );
  }

  try {
    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    const enrollment = await db.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: {
        userId,
        courseId,
      },
    });

    await db.tuition.create({
      data: {
        userId,
        courseId,
        amount: course.amount || "0",
        transactionId,
        status: "completed",
      },
    });

    return NextResponse.json({ success: true, data: enrollment });
  } catch (error) {
    console.error(`[${new Date().toISOString()} API] Callback error:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
