import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(
  request: Request,
  { params }: { params: { facultyId: string; courseworkId: string } }
) {
  try {
    const { title, abstract, description, studentId } = await request.json();
    const submission = await db.studentCourseworkSubmission.create({
      data: {
        courseworkId: params.courseworkId,
        studentId,
        title,
        abstract,
        description,
      },
    });
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit coursework" },
      { status: 500 }
    );
  }
}
