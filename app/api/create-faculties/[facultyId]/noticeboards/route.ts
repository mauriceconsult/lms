import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { facultyId: string; } }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
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
    const lastNoticeboard = await db.noticeboard.findFirst({
      where: {
        facultyId: params.facultyId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastNoticeboard
      ? (lastNoticeboard.position ?? 0) + 1
      : 1;

    const noticeboard = await db.noticeboard.create({
      data: {
        title,
        facultyId: params.facultyId,
        position: newPosition,
        userId,
      },
    });

    return NextResponse.json(noticeboard);
  } catch (error) {
    console.log("[NOTICEBOARDS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
