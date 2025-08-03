"use server";

import { db } from "@/lib/db";
import { storage } from "@/lib/storage";

export async function uploadVideo({
  file,
  tutorId,
}: {
  file: File;
  tutorId: string;
}) {
  try {
    const { assetId, playbackId, url } = await storage.uploadFile(file);

    // Validate required fields
    if (!assetId) {
      throw new Error("Asset ID is missing");
    }
    if (!playbackId) {
      throw new Error("Playback ID is missing");
    }

    const muxData = await db.muxData.create({
      data: {
        assetId, // Now guaranteed string
        playbackId, // Now guaranteed string
        tutorId,
      },
    });

    await db.tutor.update({
      where: { id: tutorId },
      data: {
        videoUrl: url || null, // Allow null if not available
        muxDataId: muxData.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Video upload failed:", error);
    throw new Error("Failed to upload video");
  }
}
