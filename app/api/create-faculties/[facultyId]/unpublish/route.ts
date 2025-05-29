import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: {
      facultyId: string; 
    }
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownFaculty = await db.faculty.findUnique({
      where: {
        id: params.facultyId,
        userId,
      },
    });
    if (!ownFaculty) {
      return new NextResponse("Unauthorized", { status: 401 });
    }   
    const unpublishedfaculty = await db.faculty.update({
      where: {
        id: params.facultyId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedfaculty = await db.faculty.findMany({
      where: {
        id: params.facultyId,
        isPublished: true,
      }
    });
    if (!publishedfaculty.length) {
      await db.faculty.update({
        where: {
          id: params.facultyId,
        },
        data: {
          isPublished: false,
        }
      })
    } 
    return NextResponse.json(unpublishedfaculty);
  } catch (error) {
    console.log("[FACULTY_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
