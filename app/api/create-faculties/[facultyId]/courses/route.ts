import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { facultyId: string; courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const facultyOwner = await db.faculty.findUnique({
      where: {
        id: params.facultyId,
        userId,
      },
    });

    if (!facultyOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const lastCourse = await db.course.findFirst({
      where: {
        facultyId: params.facultyId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastCourse ? (lastCourse.position ?? 0) + 1 : 1;

    const course = await db.course.create({
      data: {
        title,
        facultyId: params.facultyId,
        position: newPosition,
        userId,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
