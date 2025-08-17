import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string; courseCourseNoticeboardId: string; attachmentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseNoticeboardOwner = await db.courseNoticeboard.findUnique({
      where: {
        id: (await params).courseCourseNoticeboardId,
        userId: userId,
      },
    });
    if (!courseNoticeboardOwner) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const attachment = await db.attachment.delete({
      where: {
        courseNoticeboardId: (await params).courseCourseNoticeboardId,
        id: (await params).attachmentId,
      },
    });
    return NextResponse.json(attachment);
  } catch (error) {
    console.log("COURSE_NOTICEBOARD_ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
