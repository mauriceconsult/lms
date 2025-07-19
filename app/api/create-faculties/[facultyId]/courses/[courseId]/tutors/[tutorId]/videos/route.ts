import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || "",
  tokenSecret: process.env.MUX_TOKEN_SECRET || "",
});

export async function PATCH(
  request: Request,
  {
    params,
  }: { params: Promise<{ facultyId: string; courseId: string; tutorId: string }> }
) {
  const body = await request.json();
  const { videoUrl } = body;
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!videoUrl || videoUrl.length === 0) {
    return new Response("No data provided", { status: 400 });
  }
  const ownFaculty = await db.faculty.findUnique({
    where: {
      id: (await params).facultyId,
      userId,
    },
  });
  if (!ownFaculty) {
    return new Response("Course not found", { status: 404 });
  }
  const ownCourse = await db.course.findUnique({
    where: {
      id: (await params).courseId,
      facultyId: (await params).facultyId,
      userId,
    },
  });
  if (!ownCourse) {
    return new Response("Course not found", { status: 404 });
  }
  const tutor = await db.tutor.findUnique({
    where: {
      id: (await params).tutorId,
      userId,
    },
  });
  if (!tutor) {
    return new Response("Faculty not found", { status: 404 });
  }
  await db.tutor.update({
    where: {
      id: tutor.id,
    },
    data: {
      videoUrl,
    },
  });
  if (videoUrl) {
    const existingMuxData = await db.muxData.findFirst({
      where: {
        tutorId: tutor.id,
      },
    });
    if (existingMuxData) {
      await db.muxData.delete({
        where: {
          id: existingMuxData.id,
        },
      });
    }
    const asset = await mux.video.assets.create({
      input: videoUrl,
      playback_policy: ["public"],
      test: false,
    });
    await db.muxData.create({
      data: {
        tutorId: tutor.id,
        assetId: asset.id,
        playbackId:
          asset.playback_ids && asset.playback_ids.length > 0
            ? asset.playback_ids[0].id
            : null,
      },
    });
    return new Response("Success", { status: 200 });
  }
}
