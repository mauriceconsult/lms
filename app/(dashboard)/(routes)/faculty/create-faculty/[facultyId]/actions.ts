// app/faculty/create-faculty/[facultyId]/actions.ts
"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function onReorderAction(
  facultyId: string,
  updateData: { id: string; position: number }[]
) {
  try {
    const faculty = await db.faculty.findUnique({
      where: { id: facultyId },
    });
    if (!faculty) {
      return { success: false, message: "Faculty not found" };
    }
    await db.$transaction(
      updateData.map((update) =>
        db.course.update({
          where: { id: update.id },
          data: { position: update.position },
        })
      )
    );
    return { success: true, message: "Courses reordered successfully" };
  } catch (error) {
    console.error("Reorder error:", error);
    return { success: false, message: "Failed to reorder courses" };
  }
}

export async function onEditAction(facultyId: string, id: string) {
  try {
    const faculty = await db.faculty.findUnique({
      where: { id: facultyId },
    });
    if (!faculty) {
      return { success: false, message: "Faculty not found" };
    }
    const course = await db.course.findUnique({ where: { id } });
    if (!course) {
      return { success: false, message: "Course not found" };
    }
    return { success: true, message: "Edit action triggered" };
  } catch (error) {
    console.error("Edit error:", error);
    return { success: false, message: "Failed to trigger edit action" };
  }
}

export async function createCourse(
  facultyId: string,
  values: { title: string; description?: string }
) {
  try {
    const faculty = await db.faculty.findUnique({
      where: { id: facultyId },
    });
    if (!faculty) {
      return { success: false, message: "Faculty not found" };
    }
    if (values.description && values.description.length > 5000) {
      return { success: false, message: "Description exceeds 5000 characters" };
    }

    const course = await db.course.create({
      data: {
        title: values.title,
        description: values.description || "",
        userId: faculty.userId,
        facultyId,
        position: 0,
        isPublished: false,
      },
    });
    return {
      success: true,
      message: `Course "${course.title}" created successfully`,
    };
  } catch (error) {
    console.error("Create course error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "A course with this title already exists",
        };
      }
    }
    return { success: false, message: "Failed to create course" };
  }
}
