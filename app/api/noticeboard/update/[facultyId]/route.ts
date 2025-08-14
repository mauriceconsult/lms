import { updateNoticeboard } from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/noticeboard/[noticeboardId]/actions";
import { NextResponse } from "next/server";


export async function POST(
  request: Request,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { facultyId } = await params;
    const body = await request.json();
    const { noticeboardId, ...values } = body; // Extract noticeboardId from body
    console.log(
      `[${new Date().toISOString()} API: /api/noticeboard/update/[facultyId]] facultyId: ${facultyId}, noticeboardId: ${noticeboardId}, values:`,
      values
    );
    if (!noticeboardId) {
      return NextResponse.json(
        { success: false, message: "Noticeboard ID is required" },
        { status: 400 }
      );
    }
    const result = await updateNoticeboard(facultyId, noticeboardId, values);
    return NextResponse.json(result);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} API: /api/noticeboard/update/[facultyId]] Error:`,
      error
    );
    return NextResponse.json(
      { success: false, message: "Failed to update noticeboard" },
      { status: 500 }
    );
  }
}
