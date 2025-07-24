// app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/actions.ts
"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function updateCoursework(
  facultyId: string,
  values: { description?: string }
) {
  try {
    const faculty = await db.faculty.findUnique({
      where: { id: facultyId },
    });
    if (!faculty) {
      return { success: false, message: "Coursework not found" };
    }
    if (values.description && values.description.length > 5000) {
      return { success: false, message: "Description exceeds 5000 characters" };
    }

    await db.faculty.update({
      where: { id: facultyId },
      data: { description: values.description || "" },
    });
    return {
      success: true,
      message: "Coursework description updated successfully",
    };
  } catch (error) {
    console.error("Update faculty error:", error);
    return { success: false, message: "Failed to update faculty description" };
  }
}

export async function onReorderAction(
  facultyId: string,
  updateData: { id: string; position: number }[]
) {
  try {
    const faculty = await db.faculty.findUnique({
      where: { id: facultyId },
    });
    if (!faculty) {
      return { success: false, message: "Coursework not found" };
    }
    await db.$transaction(
      updateData.map((update) =>
        db.coursework.update({
          where: { id: update.id },
          data: { position: update.position },
        })
      )
    );
    return { success: true, message: "Courseworks reordered successfully" };
  } catch (error) {
    console.error("Reorder error:", error);
    return { success: false, message: "Failed to reorder courseworks" };
  }
}

export async function onEditAction(facultyId: string, id: string) {
  try {
    const faculty = await db.faculty.findUnique({
      where: { id: facultyId },
    });
    if (!faculty) {
      return { success: false, message: "Coursework not found" };
    }
    const coursework = await db.coursework.findUnique({ where: { id } });
    if (!coursework) {
      return { success: false, message: "Coursework not found" };
    }
    return { success: true, message: "Edit action triggered" };
  } catch (error) {
    console.error("Edit error:", error);
    return { success: false, message: "Failed to trigger edit action" };
  }
}

export async function createCoursework(
  facultyId: string,
  values: { title: string; description?: string }
) {
  try {
    const faculty = await db.faculty.findUnique({
      where: { id: facultyId },
    });
    if (!faculty) {
      return { success: false, message: "Coursework not found" };
    }
    if (values.description && values.description.length > 5000) {
      return { success: false, message: "Description exceeds 5000 characters" };
    }

    const coursework = await db.coursework.create({
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
      message: `Coursework "${coursework.title}" created successfully`,
    };
  } catch (error) {
    console.error("Create coursework error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "A coursework with this title already exists",
        };
      }
    }
    return { success: false, message: "Failed to create coursework" };
  }
}
