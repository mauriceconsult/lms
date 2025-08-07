import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  const { facultyId } = await params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await currentUser();
    if (user?.publicMetadata?.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { title, description, amount, isPublished, publishDate } =
      await request.json();
    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const course = await db.course.create({
      data: {
        title,
        description: description?.trim() || null,
        amount,
        isPublished: isPublished ?? false,
        publishDate: publishDate ? new Date(publishDate) : null,
        facultyId,
        position: 0,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_CREATE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string }> }
) {
  const { facultyId, courseId } = await params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await currentUser();
    if (user?.publicMetadata?.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { title, description, amount, isPublished, publishDate } =
      await request.json();
    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const course = await db.course.update({
      where: { id: courseId, facultyId },
      data: {
        title,
        description: description?.trim() || null,
        amount,
        isPublished: isPublished ?? false,
        publishDate: publishDate ? new Date(publishDate) : null,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_UPDATE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
