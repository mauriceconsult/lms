import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define the expected shape of the request body
interface ReorderRequestBody {
  list: { id: string; position: number }[];
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { list }: ReorderRequestBody = body;

    // Validate the request body
    if (
      !Array.isArray(list) ||
      !list.every(
        (item) =>
          typeof item.id === "string" && typeof item.position === "number"
      )
    ) {
      return new NextResponse(
        "Invalid request body: list must be an array of { id: string; position: number }",
        { status: 400 }
      );
    }

    const facultyId = (await params).facultyId;
    const facultyOwner = await db.faculty.findUnique({
      where: {
        id: facultyId,
        userId: userId,
      },
    });

    if (!facultyOwner) {
      return new NextResponse(
        "Unauthorized: Faculty not found or user not authorized",
        { status: 401 }
      );
    }

    // Update positions
    for (const item of list) {
      await db.coursework.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Courseworks reordered successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[COURSEWORKS_REORDER]", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
