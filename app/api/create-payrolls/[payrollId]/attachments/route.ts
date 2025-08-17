import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ payrollId: string; }>}
) {
  try {
    const userId = await auth();
    const { url } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const payrollOwner = await db.payroll.findUnique({
      where: {
        id: (await params).payrollId,
      },
    });
    if (!payrollOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
       
    const attachment = await db.attachment.create({
      data: {
        url,      
        payrollId: (await params).payrollId,
      },
    });
    return NextResponse.json(attachment)
  } catch (error) {
    console.log("PAYROLL_ID_ATTACHMENT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}