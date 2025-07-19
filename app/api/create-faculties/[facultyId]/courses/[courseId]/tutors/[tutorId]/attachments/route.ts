import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string; tutorId: string; }>}
) {
  try {
    const userId = await auth();
    const { url } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const facultyOwner = await db.faculty.findUnique({
      where: {
        id: (await params).facultyId,
      },
    });
    if (!facultyOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!facultyOwner) {
      return new NextResponse("Faculty ID is missing", { status: 400 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: (await params).courseId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!courseOwner) {
      return new NextResponse("Faculty ID is missing", { status: 400 });
    }
    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId: (await params).courseId,
        facultyId: (await params).facultyId,
        tutorId: (await params).tutorId
      }
    });
    return NextResponse.json(attachment)
  } catch (error) {
    console.log("TUTOR_ID_ATTACHMENT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}