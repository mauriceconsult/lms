import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ payrollId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const payroll = await db.payroll.findUnique({
      where: {
        id: (await params).payrollId,
        userId: userId,
      },
    });
    if (!payroll) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedPayroll = await db.payroll.delete({
      where: {
        id: (await params).payrollId,
      },
    });
    return NextResponse.json(deletedPayroll);
  } catch (error) {
    console.log("[PAYROLL_SCHOOL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ payrollId: string }>}
) {
  try {
    const { userId } = await auth();
    const { payrollId } = await params;
    const values = await req.json();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const payroll = await db.payroll.update({
      where: {
        id: payrollId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(payroll);
  } catch (error) {
    console.log("[SCHOOL_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
