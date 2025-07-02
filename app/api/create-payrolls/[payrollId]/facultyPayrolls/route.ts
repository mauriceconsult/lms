import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { payrollId: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payroll = await db.payroll.findUnique({
    where: {
      id: params.payrollId,
      userId,
    },
  });

  if (!payroll) {
    return NextResponse.json({ error: "Payroll not found" }, { status: 404 });
  }

  const data = await request.json();
  const facultyPayroll = await db.facultyPayroll.create({
    data: {
      ...data,
      payrollId: payroll.id,
      userId,
    },
  });

  return NextResponse.json(facultyPayroll, { status: 201 });
}
