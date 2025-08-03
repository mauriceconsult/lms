"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function onEditAction(facultyId: string, courseworkId: string) {
  try {
    console.log("onEditAction called with:", { facultyId, courseworkId });
    if (!facultyId || !courseworkId) {
      console.log("Invalid IDs:", { facultyId, courseworkId });
      return { success: false, message: "Invalid faculty or coursework ID" };
    }

    const { userId } = await auth();
    if (!userId) {
      console.log("No authenticated user");
      return { success: false, message: "Unauthorized" };
    }

    const coursework = await db.coursework.findUnique({
      where: { id: courseworkId },
    });
    if (!coursework || coursework.facultyId !== facultyId) {
      console.log("Coursework not found or unauthorized:", {
        courseworkId,
        facultyId,
      });
      return {
        success: false,
        message: "Coursework not found or unauthorized",
      };
    }

    // Allow edit if user is creator or createdBy is empty (legacy records)
    if (coursework.createdBy !== userId && coursework.createdBy !== "") {
      console.log("User not creator:", {
        userId,
        createdBy: coursework.createdBy,
      });
      return {
        success: false,
        message: "Only the creator can edit this coursework",
      };
    }

    await db.coursework.update({
      where: { id: courseworkId },
      data: { updatedAt: new Date() },
    });

    console.log("Edit action succeeded for:", { courseworkId });
    return { success: true, message: "Coursework edit initiated" };
  } catch (error) {
    console.error("Edit coursework error:", error);
    return { success: false, message: "Failed to edit coursework" };
  }
}

export async function createCoursework(
  facultyId: string,
  values: { title: string }
) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Unauthorized" };
  if (!facultyId) return { success: false, message: "Invalid faculty ID" };
  if (!values.title) return { success: false, message: "Title is required" };

  try {
    const coursework = await db.coursework.create({
      data: {
        title: values.title,
        facultyId,
        createdBy: userId, // Ensure createdBy is set
        userId, // Assuming userId is the tutor or creator
      },
    });
    console.log("Coursework created:", coursework.id);
    return { success: true, message: "Coursework created" };
  } catch (error) {
    console.error("Create coursework error:", error);
    return { success: false, message: "Failed to create coursework" };
  }
}

export async function onReorderAction(
  facultyId: string,
  updateData: { id: string; position: number }[]
) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Unauthorized" };
  if (!facultyId) return { success: false, message: "Invalid faculty ID" };

  try {
    await db.$transaction(
      updateData.map(({ id, position }) =>
        db.coursework.update({
          where: { id },
          data: { position },
        })
      )
    );
    console.log(
      "Reordered courseworks:",
      updateData.map((d) => d.id)
    );
    return { success: true, message: "Reordered successfully" };
  } catch (error) {
    console.error("Reorder coursework error:", error);
    return { success: false, message: "Failed to reorder courseworks" };
  }
}
