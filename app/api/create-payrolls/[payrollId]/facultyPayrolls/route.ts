import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { payrollId: string; facultyPayrollId: string } }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const payrollOwner = await db.payroll.findUnique({
      where: {
        id: params.payrollId,
        userId,
      },
    });

    if (!payrollOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const facultyPayrollOwner = await db.facultyPayroll.findUnique({
      where: {
        id: params.facultyPayrollId,
        userId,
      },
    });

    if (!facultyPayrollOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const lastPayroll = await db.facultyPayroll.findFirst({
      where: {
        payrollId: params.payrollId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastPayroll ? (lastPayroll.position ?? 0) + 1 : 1;

    const facultyPayroll = await db.facultyPayroll.create({
      data: {
        title,
        payrollId: params.payrollId,
        position: newPosition,
        userId,
      },
    });

    return NextResponse.json(facultyPayroll);
  } catch (error) {
    console.log("[FACULTY_PAYROLLS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
