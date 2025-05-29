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
    const faculty = await db.faculty.create({
      data: {
        userId,
        title,
      },
    });
    return NextResponse.json(faculty);
  } catch (error) {
    console.log("[CREATE_FACULTIES]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
