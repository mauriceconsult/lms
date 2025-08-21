// app/api/faculties/[facultyId]/route.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  const { facultyId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const faculty = await db.faculty.findUnique({
      where: { id: facultyId, isPublished: true },
      include: {
        courses: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            amount: true,
            facultyId: true,
            isPublished: true,
            tutors: {
              select: {
                id: true,
                title: true, // Adjust based on Tutor model fields
              },
            },
          },
        },
      },
    });

    if (!faculty) {
      return NextResponse.json(
        { success: false, message: "Faculty not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: faculty });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} API] Error fetching faculty:`,
      error
    );
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
