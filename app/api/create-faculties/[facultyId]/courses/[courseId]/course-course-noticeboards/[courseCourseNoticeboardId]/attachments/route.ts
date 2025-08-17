import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string; courseCourseNoticeboardId: string; }>}
) {
  try {
    const userId = await auth();
    const { url } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: (await params).courseId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const attachment = await db.attachment.create({
      data: {
        url,       
        courseId: (await params).courseId,       
      }
    });
    return NextResponse.json(attachment)
  } catch (error) {
    console.log("COURSE_NOTICEBOARD_ID_ATTACHMENT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}