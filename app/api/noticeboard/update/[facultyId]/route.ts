// app/api/noticeboard/update/[facultyId]/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ facultyId: string }> } // params is a Promise
) {
  try {
    // Await params to resolve facultyId
    const { facultyId } = await params;

    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse the request body
    const { noticeboardId, description } = await req.json();
    if (!noticeboardId) {
      return NextResponse.json(
        { success: false, message: "Noticeboard ID is required" },
        { status: 400 }
      );
    }

    // Log the request for debugging
    console.log(
      `[${new Date().toISOString()} POST /api/noticeboard/update/${facultyId}]`,
      { facultyId, noticeboardId, description }
    );

    // Verify the faculty exists
    const faculty = await db.faculty.findUnique({
      where: { id: facultyId }, // Use resolved facultyId
    });
    if (!faculty) {
      return NextResponse.json(
        { success: false, message: "Faculty not found" },
        { status: 404 }
      );
    }

    // Verify the noticeboard exists and belongs to the user
    const noticeboard = await db.noticeboard.findFirst({
      where: {
        id: noticeboardId,
        facultyId, // Use resolved facultyId
        userId, // Ensure the noticeboard belongs to the authenticated user
      },
    });
    if (!noticeboard) {
      return NextResponse.json(
        { success: false, message: "Noticeboard not found or unauthorized" },
        { status: 404 }
      );
    }

    // Validate description length (if provided)
    if (description && description.length > 5000) {
      return NextResponse.json(
        { success: false, message: "Description exceeds 5000 characters" },
        { status: 400 }
      );
    }

    // Update the noticeboard
    await db.noticeboard.update({
      where: { id: noticeboardId },
      data: { description: description || "" },
    });

    return NextResponse.json({
      success: true,
      message: "Noticeboard description updated successfully",
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} POST /api/noticeboard/update/${
        (await params).facultyId
      }] Error:`,
      error
    );
    return NextResponse.json(
      { success: false, message: "Failed to update noticeboard description" },
      { status: 500 }
    );
  }
}
