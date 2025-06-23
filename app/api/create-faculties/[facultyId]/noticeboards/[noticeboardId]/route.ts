import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { facultyId: string; noticeboardId: string } }
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
    const lastNoticeboard = await db.noticeboard.findFirst({
      where: {
        facultyId: params.facultyId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastNoticeboard ? (lastNoticeboard.position ?? 0) + 1 : 1;
    const noticeboard = await db.noticeboard.create({
      data: {
        title,
        facultyId: params.facultyId,
        position: newPosition,
        userId,
      },
    });
    return NextResponse.json(noticeboard);
  } catch (error) {
    console.log("[NOTICEBOARD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  {
    params,
  }: { params: { facultyId: string; noticeboardId: string; } }
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
  const noticeboard = await db.noticeboard.findUnique({
    where: {
      id: params.noticeboardId,
      facultyId: params.facultyId,
      userId,
    },
  });
  if (!noticeboard) {
    return new Response("Tutor not found", { status: 404 });
  }
  await db.noticeboard.update({
    where: {
      id: noticeboard.id,
    },
    data: {
      isFree,
    },
  });
  return new Response("Success", { status: 200 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { facultyId: string; noticeboardId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const noticeboardOwner = await db.noticeboard.findUnique({
      where: {
        id: params.noticeboardId,
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
    if (!noticeboardOwner) {
      return new NextResponse("Not found", { status: 404 });
    }
    // Initialize Mux Video instance with your credentials
    const mux = new Mux({
      tokenId: process.env.MUX_TOKEN_ID!,
      tokenSecret: process.env.MUX_TOKEN_SECRET!,
    });
    const video = mux.video;

    for (const tutor of noticeboardOwner.tutors) {
      if (tutor.muxData && tutor.muxData.assetId) {
        await video.assets.delete(tutor.muxData.assetId);
      }
    }
    const deletedCourse = await db.noticeboard.delete({
      where: {
        id: params.noticeboardId,
      },
    });
    const publishedCourses = await db.noticeboard.findMany({
      where: {
        facultyId: params.facultyId,
        isPublished: true,
      },
    });
    if (!publishedCourses.length) {
      await db.noticeboard.update({
        where: {
          id: params.noticeboardId,
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
