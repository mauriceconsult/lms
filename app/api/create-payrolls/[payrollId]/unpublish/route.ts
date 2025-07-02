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
    }
  }
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
    const unpublishedpayroll = await db.payroll.update({
      where: {
        id: params.payrollId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedpayroll = await db.payroll.findMany({
      where: {
        id: params.payrollId,
        isPublished: true,
      }
    });
    if (!publishedpayroll.length) {
      await db.payroll.update({
        where: {
          id: params.payrollId,
        },
        data: {
          isPublished: false,
        }
      })
    } 
    return NextResponse.json(unpublishedpayroll);
  } catch (error) {
    console.log("[PAYROLL_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
