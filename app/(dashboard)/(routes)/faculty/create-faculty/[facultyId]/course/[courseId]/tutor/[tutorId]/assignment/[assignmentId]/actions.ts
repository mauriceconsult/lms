"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateAssignment(
  assignmentId: string,
  values: { description?: string },
  facultyId: string,
  courseId: string,
  tutorId: string
) {
  try {
    console.log(
      "updateAssignment - assignmentId:",
      assignmentId,
      "values:",
      values
    );
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
    });
    if (!assignment) {
      return { success: false, message: "Assignment not found" };
    }
    if (values.description && values.description.length > 5000) {
      return { success: false, message: "Description exceeds 5000 characters" };
    }
    const updatedAssignment = await db.assignment.update({
      where: { id: assignmentId },
      data: { description: values.description || "" },
    });
    revalidatePath(
      `/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/${tutorId}`
    );
    return {
      success: true,
      message: "Assignment description updated successfully",
      data: updatedAssignment,
    };
  } catch (error) {
    console.error("Update assignment error:", error);
    return {
      success: false,
      message: "Failed to update assignment description",
    };
  }
}

export async function onReorderAction(
  tutorId: string,
  updateData: { id: string; position: number }[],
  facultyId: string,
  courseId: string
) {
  try {
    console.log(
      "onReorderAction - tutorId:",
      tutorId,
      "updateData:",
      updateData
    );
    const tutor = await db.tutor.findUnique({
      where: { id: tutorId },
    });
    if (!tutor) {
      return { success: false, message: "Tutor not found" };
    }
    await db.$transaction(
      updateData.map((update) =>
        db.assignment.update({
          where: { id: update.id },
          data: { position: update.position },
        })
      )
    );
    revalidatePath(
      `/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/${tutorId}`
    );
    return { success: true, message: "Assignments reordered successfully" };
  } catch (error) {
    console.error("Reorder error:", error);
    return { success: false, message: "Failed to reorder assignments" };
  }
}

export async function onEditAction(
  tutorId: string,
  assignmentId: string,
  facultyId: string,
  courseId: string
) {
  try {
    console.log(
      "onEditAction - tutorId:",
      tutorId,
      "assignmentId:",
      assignmentId,
      "facultyId:",
      facultyId,
      "courseId:",
      courseId
    );
    const tutor = await db.tutor.findUnique({
      where: { id: tutorId },
    });
    if (!tutor) {
      return { success: false, message: "Tutor not found" };
    }
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
    });
    if (!assignment) {
      return { success: false, message: "Assignment not found" };
    }
    // Revalidate to ensure UI updates after navigation
    revalidatePath(
      `/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/${tutorId}/assignment/${assignmentId}`
    );
    return { success: true, message: "Edit action triggered" };
  } catch (error) {
    console.error("Edit error:", error);
    return { success: false, message: "Failed to trigger edit action" };
  }
}

export async function createAssignment(
  tutorId: string,
  values: { title: string; description?: string },
  facultyId: string,
  courseId: string
) {
  try {
    console.log("createAssignment - tutorId:", tutorId, "values:", values);
    const tutor = await db.tutor.findUnique({
      where: { id: tutorId },
    });
    if (!tutor) {
      return { success: false, message: "Tutor not found" };
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
    revalidatePath(
      `/faculty/create-faculty/${facultyId}/course/${courseId}/tutor/${tutorId}`
    );
    return {
      success: true,
      message: `Assignment "${assignment.title}" created successfully`,
      data: assignment,
    };
  } catch (error) {
    console.error("Create assignment error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "An assignment with this title already exists",
        };
      }
    }
    return { success: false, message: "Failed to create assignment" };
  }
}
