import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { payrollId: string; facultyPayrollId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownPayroll = await db.payroll.findUnique({
      where: {
        id: params.payrollId,
        userId,
      },
    });
    if (!ownPayroll) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownFacultyPayroll = await db.facultyPayroll.findUnique({
      where: {
        id: params.facultyPayrollId,
        userId,
      },
    });
    if (!ownFacultyPayroll) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedPayroll = await db.facultyPayroll.update({
      where: {
        id: params.facultyPayrollId,
        payrollId: params.payrollId,
        userId,
      },
      data: {
        isPaid: false,
      },
    });
    const publishedFacultyPayrolla = await db.facultyPayroll.findMany({
      where: {
        id: params.facultyPayrollId,
        payrollId: params.payrollId,
        isPaid: true,
      },
    });
    if (!publishedFacultyPayrolla.length) {
      await db.payroll.update({
        where: {
          id: params.payrollId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(unpublishedPayroll);
  } catch (error) {
    console.log("[PAYROLL_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
