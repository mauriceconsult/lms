"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function updateCourseNoticeboard(
  courseId: string,
  values: { description?: string }
) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return { success: false, message: "CourseNoticeboard not found" };
    }
    if (values.description && values.description.length > 5000) {
      return { success: false, message: "Description exceeds 5000 characters" };
    }

    await db.course.update({
      where: { id: courseId },
      data: { description: values.description || "" },
    });
    return {
      success: true,
      message: "CourseNoticeboard description updated successfully",
    };
  } catch (error) {
    console.error("Update course error:", error);
    return { success: false, message: "Failed to update course description" };
  }
}

export async function onReorderAction(
  courseId: string,
  updateData: { id: string; position: number }[]
) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return { success: false, message: "CourseNoticeboard not found" };
    }
    await db.$transaction(
      updateData.map((update) =>
        db.courseNoticeboard.update({
          where: { id: update.id },
          data: { position: update.position },
        })
      )
    );
    return { success: true, message: "CourseNoticeboards reordered successfully" };
  } catch (error) {
    console.error("Reorder error:", error);
    return { success: false, message: "Failed to reorder courseNoticeboards" };
  }
}

export async function onEditAction(courseId: string, id: string) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return { success: false, message: "CourseNoticeboard not found" };
    }
    const courseNoticeboard = await db.courseNoticeboard.findUnique({ where: { id } });
    if (!courseNoticeboard) {
      return { success: false, message: "CourseNoticeboard not found" };
    }
    return { success: true, message: "Edit action triggered" };
  } catch (error) {
    console.error("Edit error:", error);
    return { success: false, message: "Failed to trigger edit action" };
  }
}

export async function createCourseNoticeboard(
  courseId: string,
  values: { title: string; description?: string }
) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return { success: false, message: "CourseNoticeboard not found" };
    }
    if (values.description && values.description.length > 5000) {
      return { success: false, message: "Description exceeds 5000 characters" };
    }

    const courseNoticeboard = await db.courseNoticeboard.create({
      data: {
        title: values.title,
        description: values.description || "",
        userId: course.userId,
        courseId,
        position: 0,
        isPublished: false,
      },
    });
    return {
      success: true,
      message: `CourseNoticeboard "${courseNoticeboard.title}" created successfully`,
    };
  } catch (error) {
    console.error("Create courseNoticeboard error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "A courseNoticeboard with this title already exists",
        };
      }
    }
    return { success: false, message: "Failed to create courseNoticeboard" };
  }
}
