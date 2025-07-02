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
    const payroll = await db.payroll.create({
      data: {
        userId,
        title,
      },
    });
    return NextResponse.json(payroll);
  } catch (error) {
    console.log("[CREATE_PAYROLLS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
