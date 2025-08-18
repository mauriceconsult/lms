// app/api/faculties/[facultyId]/courses/[courseId]/tuition/route.ts
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { facultyId, courseId } = await params;
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        facultyId,
        isPublished: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }
    if (!course.amount) {
      return new NextResponse("Course amount not specified", { status: 400 });
    }

    const { msisdn, username, amount } = await request.json();
    if (!msisdn || amount !== course.amount) {
      return new NextResponse("Invalid details", { status: 400 });
    }

    const existingTuition = await db.tuition.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });
    if (existingTuition) {
      return new NextResponse("Tuition already exists", { status: 400 });
    }

    const tuition = await db.tuition.create({
      data: {
        userId: user.id,
        courseId,
        amount: course.amount,
        partyId: msisdn, // Store msisdn as partyId
        username: username || null,
        isPaid: false, // Payment not yet completed
        isActive: false, // Activate after payment
      },
    });

    return NextResponse.json(
      { success: true, tuitionId: tuition.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TUITION_CREATION_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = await params;
    const tuition = await db.tuition.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (!tuition) {
      return new NextResponse("Tuition not found", { status: 404 });
    }

    return NextResponse.json(tuition, { status: 200 });
  } catch (error) {
    console.error("[TUITION_FETCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
