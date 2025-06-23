import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { facultyId: string; courseworkId: string; } }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseworkOwner = db.coursework.findUnique({
      where: {
        id: params.courseworkId,
        userId: userId,
      },
    });
    if (!courseworkOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const lastCoursework = await db.coursework.findFirst({
      where: {
        id: params.courseworkId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastCoursework ? (lastCoursework.position ?? 0) + 1 : 1;
    const coursework = await db.coursework.create({
      data: {
        title,
        id: params.courseworkId,
        position: newPosition,
        userId,
      },
    });

    return NextResponse.json(coursework);
  } catch (error) {
    console.log("[COURSEWORK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { facultyId: string; courseworkId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseworkOwner = db.coursework.findUnique({
      where: {
        id: params.facultyId,
        userId: userId,
      },
    });
    if (!courseworkOwner) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedFaculty = await db.faculty.delete({
      where: {
        id: params.facultyId,
        userId: userId,
      },
    });
    return NextResponse.json(deletedFaculty);
  } catch (error) {
    console.log("[COURSEWORK_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
