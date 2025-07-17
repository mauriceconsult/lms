import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const { facultyId, courseId } = resolvedParams;
    const values = await req.json();

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        facultyId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    await db.course.update({
      where: { id: courseId },
      data: { description: values.description ?? "" },
    });

    return new NextResponse(
      JSON.stringify({ success: true, message: "Course description updated" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} PATCH /api/create-faculties/${
        (await params).facultyId
      }/courses/${(await params).courseId}/descriptions]`,
      error
    );
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
