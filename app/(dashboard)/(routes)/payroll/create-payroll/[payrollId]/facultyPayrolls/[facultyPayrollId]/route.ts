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
    const payrollOwner = db.payroll.findUnique({
      where: {
        id: params.payrollId,
        userId: userId,
      },
    });
    if (!payrollOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const facultyPayrollOwner = db.facultyPayroll.findUnique({
      where: {
        id: params.facultyPayrollId,
        userId: userId,
      },
    });
    if (!facultyPayrollOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const lastFacultyPayroll = await db.facultyPayroll.findFirst({
      where: {
        id: params.facultyPayrollId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastFacultyPayroll ? (lastFacultyPayroll.position ?? 0) + 1 : 1;
    const facultyPayroll = await db.facultyPayroll.create({
      data: {
        title,
        id: params.facultyPayrollId,
        position: newPosition,
        userId,
      },
    });
    return NextResponse.json(facultyPayroll);
  } catch (error) {
    console.log("[COURSE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { payrollId: string; facultyPayrollId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const payrollOwner = db.payroll.findUnique({
      where: {
        id: params.payrollId,
        userId: userId,
      },
    });
    if (!payrollOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const facultyPayrollOwner = db.facultyPayroll.findUnique({
      where: {
        id: params.facultyPayrollId,
        userId: userId,
      },
    });
    if (!facultyPayrollOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
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
    const deletedFaculty = await db.payroll.delete({
      where: {
        id: params.payrollId,
        userId: userId,
      },
    });
    return NextResponse.json(deletedFaculty);
  } catch (error) {
    console.log("[PAYROLL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
