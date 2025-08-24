import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ adminId: string; courseId: string; tutorId: string; assignmentId: string; }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    } 
   
    const assignment = await db.assignment.findUnique({
      where: {
        id: (await params).assignmentId,
        tutorId: (await params).tutorId,
        userId,
      },
    });
    if (!assignment) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedAssignment = await db.assignment.delete({
      where: {
        id: (await params).assignmentId,
      },
    });
    return NextResponse.json(deletedAssignment);
  } catch (error) {
    console.log("[ASSIGNMENT_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ adminId: string; courseId: string; tutorId: string; assignmentId: string; }> }
) {
  try {
    const { userId } = await auth();
    const { assignmentId } = await params;
    const values = await req.json();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }    
    const assignment = await db.assignment.update({
      where: {
        id: assignmentId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(assignment);
  } catch (error) {
    console.log("[ASSIGNMENT_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
