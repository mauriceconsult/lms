"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function onEditAction(courseId: string, courseNoticeboardId: string) {
  try {
    console.log("onEditAction called with:", { courseId, courseNoticeboardId });
    if (!courseId || !courseNoticeboardId) {
      console.log("Invalid IDs:", { courseId, courseNoticeboardId });
      return { success: false, message: "Invalid course or courseNoticeboard ID" };
    }

    const { userId } = await auth();
    if (!userId) {
      console.log("No authenticated user");
      return { success: false, message: "Unauthorized" };
    }

    const courseNoticeboard = await db.courseNoticeboard.findUnique({
      where: { id: courseNoticeboardId },
    });
    if (!courseNoticeboard || courseNoticeboard.courseId !== courseId) {
      console.log("CourseNoticeboard not found or unauthorized:", {
        courseNoticeboardId,
        courseId,
      });
      return {
        success: false,
        message: "CourseNoticeboard not found or unauthorized",
      };
    }

    // Allow edit if user is creator or createdBy is empty (legacy records)
   
      return {
        success: false,
        message: "Only the creator can edit this courseNoticeboard",
      };
    
    await db.courseNoticeboard.update({
      where: { id: courseNoticeboardId },
      data: { updatedAt: new Date() },
    });

    console.log("Edit action succeeded for:", { courseNoticeboardId });
    return { success: true, message: "CourseNoticeboard edit initiated" };
  } catch (error) {
    console.error("Edit courseNoticeboard error:", error);
    return { success: false, message: "Failed to edit courseNoticeboard" };
  }
}

export async function createCourseNoticeboard(
  courseId: string,
  values: { title: string }
) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Unauthorized" };
  if (!courseId) return { success: false, message: "Invalid course ID" };
  if (!values.title) return { success: false, message: "Title is required" };

  try {
    const courseNoticeboard = await db.courseNoticeboard.create({
      data: {
        title: values.title,
        courseId,    
        userId,
      },
    });
    console.log("CourseNoticeboard created:", courseNoticeboard.id);
    return { success: true, message: "CourseNoticeboard created" };
  } catch (error) {
    console.error("Create courseNoticeboard error:", error);
    return { success: false, message: "Failed to create courseNoticeboard" };
  }
}

export async function onReorderAction(
  courseId: string,
  updateData: { id: string; position: number }[]
) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Unauthorized" };
  if (!courseId) return { success: false, message: "Invalid course ID" };

  try {
    await db.$transaction(
      updateData.map(({ id, position }) =>
        db.courseNoticeboard.update({
          where: { id },
          data: { position },
        })
      )
    );
    console.log(
      "Reordered courseNoticeboards:",
      updateData.map((d) => d.id)
    );
    return { success: true, message: "Reordered successfully" };
  } catch (error) {
    console.error("Reorder courseNoticeboard error:", error);
    return { success: false, message: "Failed to reorder courseNoticeboards" };
  }
}
