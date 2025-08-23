"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ adminId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} CourseCreateAPI] Unauthorized: No userId`
    );
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { adminId } = await params;
  const body = await request.json();
  const { title, description, imageUrl, amount, isPublished } = body;

  if (!title) {
    console.log(
      `[${new Date().toISOString()} CourseCreateAPI] Invalid request: Missing title`
    );
    return new NextResponse("Missing title", { status: 400 });
  }

  // Validate amount if provided or required for publishing
  if (isPublished) {
    if (
      !amount ||
      typeof amount !== "string" ||
      !/^\d+(\.\d{1,2})?$/.test(amount)
    ) {
      console.log(
        `[${new Date().toISOString()} CourseCreateAPI] Invalid amount for published course: ${amount}`
      );
      return new NextResponse(
        "Published courses must have a valid amount (e.g., '100.00')",
        { status: 400 }
      );
    }
  } else if (
    amount &&
    (typeof amount !== "string" || !/^\d+(\.\d{1,2})?$/.test(amount))
  ) {
    console.log(
      `[${new Date().toISOString()} CourseCreateAPI] Invalid amount format: ${amount}`
    );
    return new NextResponse("Invalid amount format (e.g., '100.00')", {
      status: 400,
    });
  }

  try {
    // Verify faculty exists (mapped as admin)
    const faculty = await db.faculty.findUnique({
      where: { id: adminId },
    });

    if (!faculty) {
      console.log(
        `[${new Date().toISOString()} CourseCreateAPI] Faculty not found: ${adminId}`
      );
      return new NextResponse("Admin not found", { status: 404 });
    }

    const course = await db.course.create({
      data: {
        title,
        description,
        imageUrl,
        amount, // Keep as string
        facultyId: adminId,
        userId,
        isPublished: isPublished || false,
        publishDate: isPublished ? new Date() : null,
      },
    });

    console.log(
      `[${new Date().toISOString()} CourseCreateAPI] Course created`,
      { courseId: course.id, adminId, userId }
    );

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} CourseCreateAPI] Error:`,
      error
    );
    return new NextResponse("Internal Error", { status: 500 });
  }
}
