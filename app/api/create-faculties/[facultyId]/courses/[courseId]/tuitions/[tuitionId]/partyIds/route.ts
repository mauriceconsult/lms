import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      facultyId: string;
      courseId: string;
      tuitionId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    const { partyId } = await req.json();
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
    
    const tuition = await db.tuition.update({
      where: {
        id: params.tuitionId,
        courseId: params.courseId,
        userId,
      },
      data: {
        partyId,
      },
    });

    return NextResponse.json(tuition);
  } catch (error) {
    console.error("[TUITION_PARTY_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}