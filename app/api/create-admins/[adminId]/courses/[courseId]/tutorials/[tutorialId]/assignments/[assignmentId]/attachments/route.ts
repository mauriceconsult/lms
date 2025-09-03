import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: {
    params: Promise<{
      adminId: string; courseId: string; tutorialId: string; assignmentId: string;
    }>
  }
) {
  try {
    const userId = await auth();
    const { url } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const assignmentOwner = await db.assignment.findUnique({
      where: {
        id: (await params).assignmentId,
      },
    });
    if (!assignmentOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const attachment = await db.attachment.create({
      data: {
        url,        
        assignmentId: (await params).assignmentId,       
      }
    });
    return NextResponse.json(attachment)
  } catch (error) {
    console.log("ASSIGNMENT_ID_ATTACHMENT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}