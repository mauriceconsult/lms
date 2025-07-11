import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { partyId } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }
    const courseEnrollment = await db.courseEnrollment.create({
      data: {
        userId,
        partyId,
        courseId: req.headers.get("courseId") || "",
      },
    });
    return NextResponse.json(courseEnrollment);
  } catch (error) {
    console.log("[CREATE_COURSE_ENROLLMENT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
