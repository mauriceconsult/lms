"use server";

import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function createAdmin(facultyId: string, userId: string) {
  try {
    const existingAdmin = await db.admin.findFirst({
      where: { facultyId, userId },
    });
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin);
      return existingAdmin;
    }

    // Verify faculty exists, create if not (for testing)
    const faculty = await db.faculty.findUnique({ where: { id: facultyId } });
    if (!faculty) {
      console.warn(`Faculty ${facultyId} not found, creating placeholder`);
      await db.faculty.create({
        data: {
          id: facultyId,
          title: "Placeholder Faculty",
          createdBy: userId,
        },
      });
    }

    const admin = await db.admin.create({
      data: {
        id: uuidv4(),
        userId,
        facultyId,
      },
    });
    console.log("Admin created:", admin);
    return admin;
  } catch (error) {
    console.error("[CREATE_ADMIN_ERROR]", error);
    throw new Error("Failed to create admin");
  }
}
