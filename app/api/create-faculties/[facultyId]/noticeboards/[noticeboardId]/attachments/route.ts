import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ facultyId: string; noticeboardId: string; }>}
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
      }
    });
    if (!facultyOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const attachment = await db.attachment.create({
      data: {
        url,
        // name: url.split("/").pop(),
        noticeboardId: (await params).noticeboardId,
        facultyId: (await params).facultyId,
      }
    });
    return NextResponse.json(attachment)
  } catch (error) {
    console.log("NOTICEBOARD_ID_ATTACHMENT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}