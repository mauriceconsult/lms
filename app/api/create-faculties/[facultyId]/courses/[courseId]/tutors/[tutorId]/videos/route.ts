import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || "",
  tokenSecret: process.env.MUX_TOKEN_SECRET || "",
});

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ facultyId: string; courseId: string; tutorId: string }>;
  }
) {
  try {
    const body = await request.json();
    const { videoUrl } = body;
    const { userId } = await auth();
    const { facultyId, courseId, tutorId } = await params;

    console.log("PATCH Params:", { facultyId, courseId, tutorId });
    console.log("Request body:", { videoUrl });

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!videoUrl || videoUrl.length === 0) {
      return new NextResponse("No data provided", { status: 400 });
    }

    const tutor = await db.tutor.findUnique({
      where: {
        id: tutorId,
        userId,
      },
      include: { muxData: true },
    });
    if (!tutor) {
      return new NextResponse("Tutor not found", { status: 404 });
    }

    const updatedTutor = await db.tutor.update({
      where: { id: tutorId },
      data: { videoUrl },
      include: { muxData: true },
    });

    if (videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { tutorId: tutor.id },
      });
      if (existingMuxData) {
        await db.muxData.delete({
          where: { id: existingMuxData.id },
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
    }

    revalidatePath(
      `/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/${tutorId}`
    );
    return NextResponse.json(updatedTutor);
  } catch (error) {
    console.error("[TUTOR_VIDEO_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
