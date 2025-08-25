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
    params: Promise<{ adminId: string; courseId: string; tutorialId: string }>;
  }
) {
  try {
    const body = await request.json();
    const { videoUrl } = body;
    const { userId } = await auth();
    const { adminId, courseId, tutorialId } = await params;

    console.log("PATCH Params:", { adminId, courseId, tutorialId });
    console.log("Request body:", { videoUrl });

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!videoUrl || videoUrl.length === 0) {
      return new NextResponse("No data provided", { status: 400 });
    }

    const tutorial = await db.tutor.findUnique({
      where: {
        id: tutorialId,
        userId,
      },
      include: { muxData: true },
    });
    if (!tutorial) {
      return new NextResponse("Tutor not found", { status: 404 });
    }

    const updatedTutorial = await db.tutor.update({
      where: { id: tutorialId },
      data: { videoUrl },
      include: { muxData: true },
    });

    if (videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { tutorId: tutorial.id },
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
          tutorId: tutorial.id,
          assetId: asset.id,
          playbackId:
            asset.playback_ids && asset.playback_ids.length > 0
              ? asset.playback_ids[0].id
              : null,
        },
      });
    }

    revalidatePath(
      `/admin/create-admin/${adminId}/course/${courseId}/tutorial/${tutorialId}`
    );
    return NextResponse.json(updatedTutorial);
  } catch (error) {
    console.error("[TUTORIAL_VIDEO_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
