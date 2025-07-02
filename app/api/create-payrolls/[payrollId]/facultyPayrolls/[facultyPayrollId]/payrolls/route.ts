import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { payrollId: string; facultyPayrollId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const payroll = await db.payroll.findUnique({
      where: {
        id: params.payrollId,
        userId: userId,
      },
    });
    if (!payroll) {
      return new NextResponse("Not found", { status: 404 });
    }
    const facultyPayroll = await db.facultyPayroll.findUnique({
      where: {
        id: params.facultyPayrollId,
        userId: userId,
      },
    });
    if (!facultyPayroll) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedFacultyPayroll = await db.facultyPayroll.delete({
      where: {
        id: params.facultyPayrollId,
      },
    });
    return NextResponse.json(deletedFacultyPayroll);
  } catch (error) {
    console.log("[PAYROLL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { payrollId: string; facultyPayrollId: string } }
) {
  try {
    const { userId } = await auth();
    const { facultyPayrollId } = params;
    const values = await req.json();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const payroll = await db.payroll.findUnique({
      where: {
        id: params.payrollId,
        userId: userId,
      },
    });
    if (!payroll) {
      return new NextResponse("Not found", { status: 404 });
    }

    const facultyPayroll = await db.facultyPayroll.update({
      where: {
        id: facultyPayrollId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(facultyPayroll);
  } catch (error) {
    console.log("[PAYROLL_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
