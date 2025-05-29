import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthrorized", { status: 401 });
    }
    const doc = await db.doc.create({
      data: {
        userId,
        title,
      },
    });
    return NextResponse.json(doc);
  } catch (error) {
    console.log("[DOCS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
