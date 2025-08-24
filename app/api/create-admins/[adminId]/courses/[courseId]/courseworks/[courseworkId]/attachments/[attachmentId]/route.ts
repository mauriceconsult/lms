import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ adminId: string; courseId: string; courseworkId: string; attachmentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseworkOwner = await db.coursework.findUnique({
      where: {
        id: (await params).courseworkId,
        userId: userId,
      },
    });
    if (!courseworkOwner) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const attachment = await db.attachment.delete({
      where: {
        courseworkId: (await params).courseworkId,
        id: (await params).attachmentId,
      },
    });
    return NextResponse.json(attachment);
  } catch (error) {
    console.log("COURSEWORK_ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
