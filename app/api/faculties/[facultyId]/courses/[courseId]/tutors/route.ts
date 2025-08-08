import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { facultyId: string; courseId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (user?.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { title, isFree } = await request.json();
    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const tutor = await db.tutor.create({
      data: {
        title,
        isFree,
        courseId: params.courseId,
        position: 0,
      },
    });

    return NextResponse.json(tutor);
  } catch (error) {
    console.error("[TUTOR_CREATE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
