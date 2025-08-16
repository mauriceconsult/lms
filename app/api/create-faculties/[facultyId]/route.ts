import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const facultyOwner = db.faculty.findUnique({
      where: {
        id: (await params).facultyId,
        userId: userId,
      },
    });
    if (!facultyOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const lastFaculty = await db.faculty.findFirst({
      where: {
        id: (await params).facultyId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastFaculty ? (lastFaculty.position ?? 0) + 1 : 1;
    const faculty = await db.faculty.create({
      data: {
        title,
        id: (await params).facultyId,
        position: newPosition,
        userId,
      },
    });

    return NextResponse.json(faculty);
  } catch (error) {
    console.log("[FACULTY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const facultyOwner = db.faculty.findUnique({
      where: {
        id: (await params).facultyId,
        userId: userId,
      },
      include: {
        courses: {
          where: {
            isPublished: true,
          },
          include: {
            tutors: {
              where: {
                isPublished: true,
              },
              include: {
                muxData: true,
              },
            },
          },
        },
      },
    });
    if (!facultyOwner) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedFaculty = await db.faculty.delete({
      where: {
        id: (await params).facultyId,
        userId: userId,
      },
    });
    return NextResponse.json(deletedFaculty);
  } catch (error) {
    console.log("[FACULTY_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
