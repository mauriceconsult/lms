// app/api/faculties/[facultyId]/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { facultyId } = await params;

    const faculty = await db.faculty.findFirst({
      where: {
        id: facultyId,
        userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        isPublished: true,
        courses: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            isPublished: true,
            // tutorId: true,
          },
          orderBy: {
            title: "asc",
          },
        },
      },
    });

    if (!faculty) {
      return NextResponse.json(
        { success: false, message: "Faculty not found or unauthorized" },
        { status: 404 }
      );
    }

    console.log(
      `[${new Date().toISOString()} GET /api/faculties/${facultyId}] Faculty fetched:`,
      faculty
    );

    return NextResponse.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} GET /api/faculties/${
        (await params).facultyId
      }] Error:`,
      error
    );
    return NextResponse.json(
      { success: false, message: "Failed to fetch faculty" },
      { status: 500 }
    );
  }
}
