import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ facultyId: string; courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { facultyId, courseId } = await params;
    const { tutorId, courseworkId } = await req.json();

    if (!tutorId || !courseworkId) {
      return new NextResponse("Missing tutorId or courseworkId", {
        status: 400,
      });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, facultyId },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const tutor = await db.tutor.findUnique({
      where: { id: tutorId, courseId },
    });

    if (!tutor) {
      return new NextResponse("Tutor not found", { status: 404 });
    }

    const coursework = await db.coursework.findUnique({
      where: { id: courseworkId, courseId },
    });

    if (!coursework) {
      return new NextResponse("Coursework not found", { status: 404 });
    }

    // const existingAssignment = await db.assignment.findUnique({
    //   where: { tutorId_courseworkId: { tutorId, courseworkId } },
    // });

    // if (existingAssignment) {
    //   return new NextResponse("Tutor already paired with this assignment", {
    //     status: 400,
    //   });
    // }

    const assignment = await db.assignment.create({
      data: {
        tutorId,
        userId,
        title: `${tutor.title} - ${coursework.title}`,        
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("[TUTOR_ASSIGNMENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
