import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }
    const notice = await db.noticeBoard.create({
      data: {
        title,
        userId,
      },
    });
    return NextResponse.json(notice);
  } catch (error) {
    console.log("[CREATE_NOTICES]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
