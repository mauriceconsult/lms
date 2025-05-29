import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { docId: string; } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownReceipt = db.doc.findUnique({
      where: {
        id: params.docId,
        userId,
      }
    });
    if (!ownReceipt) {
      return new NextResponse("Unauthorized", {status: 401})
    }
    const course = await db.doc.findUnique({
      where: {
        id: params.docId,        
      }
    });
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }
    
    const { docId } = params;
    const deletedReceipt = await db.doc.delete({
      where: {
        id: docId,        
      },
    });
    return NextResponse.json(deletedReceipt);
  } catch (error) {
    console.error("Error deleting doc:", error);
    return NextResponse.json(
      { error: "Failed to delete doc" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { docId: string; courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { ...values } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const docOwner = await db.doc.findUnique({
      where: {
        id: params.docId,
        userId,
      },
    });
    if (!docOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const doc = await db.doc.update({
      where: {
            id: params.docId,
          userId,
        
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.log("[FACULTY_DOC_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
