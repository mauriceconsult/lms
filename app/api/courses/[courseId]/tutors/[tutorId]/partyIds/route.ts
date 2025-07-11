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
    const tuition = await db.tuition.create({
      data: {
        userId,
        partyId,
        courseId: req.headers.get("courseId") || "",
      },
    });
    return NextResponse.json(tuition);
  } catch (error) {
    console.log("[CREATE_TUITION]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
