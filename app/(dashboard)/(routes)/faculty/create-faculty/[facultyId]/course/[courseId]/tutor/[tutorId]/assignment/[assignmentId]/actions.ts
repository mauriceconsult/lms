// app/(dashboard)/(routes)/tutor/create-tutor/[tutorId]/actions.ts
"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function updateAssignment( 
  assignmentId: string,
  values: { description?: string }
) {
  try {
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
    });
    if (!assignment) {
      return { success: false, message: "Assignment not found" };
    }
    if (values.description && values.description.length > 5000) {
      return { success: false, message: "Description exceeds 5000 characters" };
    }   
    await db.assignment.update({
      where: { id: assignmentId },
      data: { description: values.description || "" },
    });
    return {
      success: true,
      message: "Assignment description updated successfully",
    };
  } catch (error) {
    console.error("Update tutor error:", error);
    return { success: false, message: "Failed to update tutor description" };
  }
}

export async function onReorderAction(
  tutorId: string,
  updateData: { id: string; position: number }[]
) {
  try {
    const tutor = await db.tutor.findUnique({
      where: { id: tutorId },
    });
    if (!tutor) {
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

export async function onEditAction(tutorId: string, id: string) {
  try {
    const tutor = await db.tutor.findUnique({
      where: { id: tutorId },
    });
    if (!tutor) {
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
  tutorId: string,
  values: { title: string; description?: string }
) {
  try {
    const tutor = await db.tutor.findUnique({
      where: { id: tutorId },
    });
    if (!tutor) {
      return { success: false, message: "Assignment not found" };
    }
    if (values.description && values.description.length > 5000) {
      return { success: false, message: "Description exceeds 5000 characters" };
    }

    const assignment = await db.assignment.create({
      data: {
        title: values.title,
        description: values.description || "",
        userId: tutor.userId || "",
        tutorId,
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
