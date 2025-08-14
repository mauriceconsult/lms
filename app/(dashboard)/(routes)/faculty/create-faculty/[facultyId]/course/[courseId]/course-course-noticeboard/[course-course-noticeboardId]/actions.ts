"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function onEditAction(courseId: string, courseCourseNoticeboardId: string) {
  try {
    console.log("onEditAction called with:", { courseId, courseCourseNoticeboardId });
    if (!courseId || !courseCourseNoticeboardId) {
      console.log("Invalid IDs:", { courseId, courseCourseNoticeboardId });
      return { success: false, message: "Invalid course or courseCourseNoticeboard ID" };
    }

    const { userId } = await auth();
    if (!userId) {
      console.log("No authenticated user");
      return { success: false, message: "Unauthorized" };
    }

    const courseCourseNoticeboard = await db.courseNoticeboard.findUnique({
      where: { id: courseCourseNoticeboardId },
    });
    if (!courseCourseNoticeboard || courseCourseNoticeboard.courseId !== courseId) {
      console.log("Course Noticeboard not found or unauthorized:", {
        courseCourseNoticeboardId,
        courseId,
      });
      return {
        success: false,
        message: "Course Noticeboard not found or unauthorized",
      };
    }

    // Allow edit if user is creator or createdBy is empty (legacy records)
    if (courseCourseNoticeboard.createdBy !== userId && courseCourseNoticeboard.createdBy !== "") {
      console.log("User not creator:", {
        userId,
        createdBy: courseCourseNoticeboard.createdBy,
      });
      return {
        success: false,
        message: "Only the creator can edit this Course Noticeboard",
      };
    }

    await db.courseNoticeboard.update({
      where: { id: courseCourseNoticeboardId },
      data: { updatedAt: new Date() },
    });

    console.log("Edit action succeeded for:", { courseCourseNoticeboardId });
    return { success: true, message: "CourseNoticeboard edit initiated" };
  } catch (error) {
    console.error("Edit Course Notice error:", error);
    return { success: false, message: "Failed to edit Course Notice" };
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
    const courseCourseNoticeboard = await db.courseNoticeboard.create({
      data: {
        title: values.title,
        courseId,
        createdBy: userId, // Ensure createdBy is set
        userId, // Assuming userId is the tutor or creator
      },
    });
    console.log("CourseNoticeboard created:", courseCourseNoticeboard.id);
    return { success: true, message: "CourseNoticeboard created" };
  } catch (error) {
    console.error("Create courseCourseNoticeboard error:", error);
    return { success: false, message: "Failed to create courseCourseNoticeboard" };
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
      "Reordered Course Notices:",
      updateData.map((d) => d.id)
    );
    return { success: true, message: "Reordered successfully" };
  } catch (error) {
    console.error("Reorder Course Notices error:", error);
    return { success: false, message: "Failed to reorder Course Notices" };
  }
}
