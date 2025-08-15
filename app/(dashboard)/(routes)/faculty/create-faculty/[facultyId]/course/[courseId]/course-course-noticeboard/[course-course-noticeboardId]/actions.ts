"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function onEditAction(courseId: string, courseNoticeboardId: string) {
  try {
    if (!courseId || !courseNoticeboardId) {
      return { success: false, message: "Invalid course or courseNoticeboard ID" };
    }

    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const courseNoticeboard = await db.courseNoticeboard.findUnique({
      where: { id: courseNoticeboardId },
      include: { course: true },
    });

    if (!courseNoticeboard || courseNoticeboard.courseId !== courseId) {
      return {
        success: false,
        message: "CourseNoticeboard not found or unauthorized",
      };
    }

    await db.courseNoticeboard.update({
      where: { id: courseNoticeboardId },
      data: { updatedAt: new Date() },
    });

    return { success: true, message: "CourseNoticeboard edit initiated" };
  } catch (error) {
    console.error("Edit courseNoticeboard error:", error);
    return { success: false, message: "Failed to edit courseNoticeboard" };
  }
}
