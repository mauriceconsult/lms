"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function updateAssignment(
  courseId: string,
  values: { description?: string }
) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return { success: false, message: "Assignment not found" };
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
      message: "Assignment description updated successfully",
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
      return { success: false, message: "Assignment not found" };
    }
    await db.$transaction(
      updateData.map((update) =>
        db.assignment.update({
          where: { id: update.id },
          data: { position: update.position },
        })
      )
    );
    return { success: true, message: "Assignments reordered successfully" };
  } catch (error) {
    console.error("Reorder error:", error);
    return { success: false, message: "Failed to reorder assignments" };
  }
}

export async function onEditAction(courseId: string, id: string) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return { success: false, message: "Assignment not found" };
    }
    const assignment = await db.assignment.findUnique({ where: { id } });
    if (!assignment) {
      return { success: false, message: "Assignment not found" };
    }
    return { success: true, message: "Edit action triggered" };
  } catch (error) {
    console.error("Edit error:", error);
    return { success: false, message: "Failed to trigger edit action" };
  }
}

export async function createAssignment(
  courseId: string,
  values: { title: string; description?: string }
) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return { success: false, message: "Assignment not found" };
    }
    if (values.description && values.description.length > 5000) {
      return { success: false, message: "Description exceeds 5000 characters" };
    }

    const assignment = await db.assignment.create({
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
      message: `Assignment "${assignment.title}" created successfully`,
    };
  } catch (error) {
    console.error("Create assignment error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "A assignment with this title already exists",
        };
      }
    }
    return { success: false, message: "Failed to create assignment" };
  }
}
