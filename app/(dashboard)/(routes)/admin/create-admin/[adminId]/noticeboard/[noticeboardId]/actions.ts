"use server";

import { db } from "@/lib/db";
import { Prisma, Noticeboard } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function onEditAction(adminId: string, id: string) {
  try {
    const admin = await db.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin) {
      return { success: false, message: "Admin not found" };
    }
    const noticeboard = await db.noticeboard.findUnique({ where: { id } });
    if (!noticeboard) {
      return { success: false, message: "Noticeboard not found" };
    }
    return { success: true, message: "Edit action triggered" };
  } catch (error) {
    console.error("Edit error:", error);
    return { success: false, message: "Failed to trigger edit action" };
  }
}

export async function createNoticeboard(
  adminId: string,
  values: { title: string; description?: string }
): Promise<{ success: boolean; message: string; data?: Noticeboard }> {
  try {
    const admin = await db.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin) {
      return { success: false, message: "Admin not found" };
    }
    const noticeboard = await db.noticeboard.create({
      data: {
        title: values.title,
        description: values.description || "",
        userId: admin.userId,
        adminId,
        position: 0,
        isPublished: false,
      },
    });
    revalidatePath(`/admin/create-admin/${adminId}`);
    return {
      success: true,
      message: `Noticeboard "${noticeboard.title}" created successfully`,
      data: noticeboard,
    };
  } catch (error) {
    console.error("Create noticeboard error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "A noticeboard with this title already exists",
        };
      }
    }
    return { success: false, message: "Failed to create noticeboard" };
  }
}
