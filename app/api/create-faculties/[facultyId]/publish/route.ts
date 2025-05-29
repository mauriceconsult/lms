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
    };
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
    const faculty = await db.faculty.findUnique({
      where: {
        id: params.facultyId,
        userId,
      },
      include: {
        courses: true,
      },
    });
    const hasPublishedCourse =
      faculty && faculty.courses
        ? faculty.courses.some((course) => course.isPublished)
        : false;
    if (
      !faculty ||
      !faculty.description ||
      !faculty.title ||
      !faculty.imageUrl ||
      !hasPublishedCourse
    ) {
      return new NextResponse("Missing credentials", { status: 400 });
    }

    const publishedfaculty = await db.faculty.update({
      where: {
        id: params.facultyId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedfaculty);
  } catch (error) {
    console.log("[FACULTY_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
