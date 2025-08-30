// app/api/courses/[courseId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: (await params).courseId },
      select: { amount: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ amount: course.amount || "0" });
  } catch (error) {
    console.error("[API/courses/[courseId]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course data" },
      { status: 500 }
    );
  }
}
