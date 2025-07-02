import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: {
      payrollId: string; 
     facultyPayrollId: string;
    }
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const payroll = await db.payroll.findUnique({
      where: {
        id: params.payrollId,
        userId,
      }  
    });
    if (!payroll) {
      return new NextResponse("Not found", { status: 404 });
    } 

    const facultyPayroll = await db.facultyPayroll.findUnique({
      where: {
        id: params.facultyPayrollId,
        payrollId: params.payrollId,
      },
      // include: {
      //   tutors: true,
      // },
    });  
    const hasPaidPayroll = facultyPayroll?.isPaid;

    if (
      !facultyPayroll      
      ||
      !facultyPayroll.title      
      ||     
      !hasPaidPayroll
    ) {
      return new NextResponse("Missing credentials", { status: 400 });
    }   
    const publishedCourse = await db.facultyPayroll.update({
      where: {
        id: params.facultyPayrollId,
        payrollId: params.payrollId,
      },
      data: {
        isPaid: true,
      },
    });
    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("[FACULTY_PAYROLL_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
