"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

export async function uploadVideo({ tutorId }: { tutorId: string }) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Simulate uploading to Mux
  const playbackId = `mux_${uuidv4()}`; // Replace with actual Mux API call

  // Update tutor with playbackId
  await db.tutor.update({
    where: { id: tutorId },
    data: { playbackId },
  });

  return playbackId;
}
