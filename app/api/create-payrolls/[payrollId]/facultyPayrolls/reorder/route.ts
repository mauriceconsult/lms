import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { payrollId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { list } = await req.json();
    const payrollOwner = db.payroll.findUnique({
      where: {
        id: params.payrollId,
        userId: userId,
      },
    });
    if (!payrollOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }    
    for (const item of list) {
      await db.payroll.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }
    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[PAYROLLS_REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
