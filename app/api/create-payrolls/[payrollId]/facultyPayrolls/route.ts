import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { payrollId: string; } }
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
    const lastCourse = await db.course.findFirst({
      where: {
        id: params.payrollId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastCourse ? (lastCourse.position ?? 0) + 1 : 1;

    const course = await db.course.create({
      data: {
        title,
        id: params.payrollId,
        position: newPosition,
        userId,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[FACULTY_PAYROLLS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
