import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { facultyId: string; courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const facultyOwner = db.faculty.findUnique({
      where: {
        id: params.facultyId,
        userId: userId,
      },
    });
    if (!facultyOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const lastCourse = await db.course.findFirst({
      where: {
        facultyId: params.facultyId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastCourse ? (lastCourse.position ?? 0) + 1 : 1;
    const course = await db.course.create({
      data: {
        title,
        facultyId: params.facultyId,
        position: newPosition,
        userId,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  {
    params,
  }: { params: { facultyId: string; courseId: string; } }
) {
  const body = await request.json();
  const { isFree } = body;
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!isFree || isFree.length === 0) {
    return new Response("No data provided", { status: 400 });
  }
  const ownFaculty = await db.faculty.findUnique({
    where: {
      id: params.facultyId,    
      userId,
    },
  });
  if (!ownFaculty) {
    return new Response("Faculty not found", { status: 404 });
  }
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      facultyId: params.facultyId,
      userId,
    },
  });
  if (!course) {
    return new Response("Tutor not found", { status: 404 });
  }
  await db.course.update({
    where: {
      id: course.id,
    },
    data: {
      isFree,
    },
  });
  return new Response("Success", { status: 200 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { facultyId: string; courseId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        facultyId: params.facultyId,
        userId: userId,
      },
      include: {
        tutors: {
          where: {
            isPublished: true
          },
          include: {
            muxData: true
          }
        }
      },
    });
    if (!courseOwner) {
      return new NextResponse("Not found", { status: 404 });
    }
    // Initialize Mux Video instance with your credentials
    const mux = new Mux({
      tokenId: process.env.MUX_TOKEN_ID!,
      tokenSecret: process.env.MUX_TOKEN_SECRET!,
    });
    const video = mux.video;

    for (const tutor of courseOwner.tutors) {
      if (tutor.muxData && tutor.muxData.assetId) {
        await video.assets.delete(tutor.muxData.assetId);
      }
    }
    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });
    const publishedCourses = await db.course.findMany({
      where: {
        facultyId: params.facultyId,
        isPublished: true,
      },
    });
    if (!publishedCourses.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
