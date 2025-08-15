"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function onEditAction(courseId: string, courseworkId: string) {
  try {
    if (!courseId || !courseworkId) {
      return { success: false, message: "Invalid course or coursework ID" };
    }

    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const coursework = await db.coursework.findUnique({
      where: { id: courseworkId },
      include: { course: true },
    });

    if (!coursework || coursework.courseId !== courseId) {
      return {
        success: false,
        message: "Coursework not found or unauthorized",
      };
    }

    await db.coursework.update({
      where: { id: courseworkId },
      data: { updatedAt: new Date() },
    });

    return { success: true, message: "Coursework edit initiated" };
  } catch (error) {
    console.error("Edit coursework error:", error);
    return { success: false, message: "Failed to edit coursework" };
  }
}
