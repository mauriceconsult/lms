import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const faculty = await db.faculty.findUnique({
      where: {
        id: (await params).facultyId,
        userId: userId,
      },
    });
    if (!faculty) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedFaculty = await db.faculty.delete({
      where: {
        id: (await params).facultyId,
      },
    });
    return NextResponse.json(deletedFaculty);
  } catch (error) {
    console.log("[FACULTY_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { userId } = await auth();
    const { facultyId } = await params;
    const values = await req.json();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const faculty = await db.faculty.update({
      where: {
        id: facultyId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(faculty);
  } catch (error) {
    console.log("[FACULTY_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
