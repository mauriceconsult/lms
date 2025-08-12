// app/(dashboard)/(routes)/course/create-course/[courseId]/actions.ts
"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function updateTutor( 
  tutorId: string,
  values: { description?: string }
) {
  try {
    const tutor = await db.tutor.findUnique({
      where: { id: tutorId },
    });
    if (!tutor) {
      return { success: false, message: "Tutor not found" };
    }
    if (values.description && values.description.length > 5000) {
      return { success: false, message: "Description exceeds 5000 characters" };
    }   
    await db.tutor.update({
      where: { id: tutorId },
      data: { description: values.description || "" },
    });
    return {
      success: true,
      message: "Tutor description updated successfully",
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
      return { success: false, message: "Tutor not found" };
    }
    await db.$transaction(
      updateData.map((update) =>
        db.tutor.update({
          where: { id: update.id },
          data: { position: update.position },
        })
      )
    );
    return { success: true, message: "Tutors reordered successfully" };
  } catch (error) {
    console.error("Reorder error:", error);
    return { success: false, message: "Failed to reorder tutors" };
  }
}

export async function onEditAction(courseId: string, id: string) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return { success: false, message: "Tutor not found" };
    }
    const tutor = await db.tutor.findUnique({ where: { id } });
    if (!tutor) {
      return { success: false, message: "Tutor not found" };
    }
    return { success: true, message: "Edit action triggered" };
  } catch (error) {
    console.error("Edit error:", error);
    return { success: false, message: "Failed to trigger edit action" };
  }
}

export async function createTutor(
  courseId: string,
  values: { title: string; description?: string }
) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return { success: false, message: "Tutor not found" };
    }
    if (values.description && values.description.length > 5000) {
      return { success: false, message: "Description exceeds 5000 characters" };
    }

    const tutor = await db.tutor.create({
      data: {
        title: values.title,
        description: values.description || "",
        userId: course.userId || "",
        courseId,
        position: 0,
        isPublished: false,
      },
    });
    return {
      success: true,
      message: `Tutor "${tutor.title}" created successfully`,
    };
  } catch (error) {
    console.error("Create tutor error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "A tutor with this title already exists",
        };
      }
    }
    return { success: false, message: "Failed to create tutor" };
  }
}
