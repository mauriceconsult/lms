import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { facultyId: string; courseId: string; }}
) {
  try {
    const userId = await auth();
    const { url } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId, 
        facultyId: params.facultyId,         
      }
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!courseOwner.facultyId) {
      return new NextResponse("Faculty ID is missing", { status: 400 });
    }
    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId: params.courseId,
        facultyId: params.facultyId,
      }
    });
    return NextResponse.json(attachment)
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}