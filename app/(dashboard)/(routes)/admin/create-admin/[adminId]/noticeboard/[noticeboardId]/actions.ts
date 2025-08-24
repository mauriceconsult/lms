"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function updateNoticeboard(
  adminId: string,
  noticeboardId: string,
  values: { description?: string }
) {
  try {
    console.log(
      `[${new Date().toISOString()} updateNoticeboard] adminId: ${adminId}, noticeboardId: ${noticeboardId}, values:`,
      values
    );
    const admin = await db.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin) {
      return { success: false, message: "Faculty not found" };
    }
    const noticeboard = await db.noticeboard.findUnique({
      where: { id: noticeboardId },
    });
    if (!noticeboard) {
      return { success: false, message: "Noticeboard not found" };
    }
    if (values.description && values.description.length > 5000) {
      return { success: false, message: "Description exceeds 5000 characters" };
    }
    await db.noticeboard.update({
      where: { id: noticeboardId },
      data: { description: values.description || "" },
    });
    return {
      success: true,
      message: "Noticeboard description updated successfully",
    };
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} updateNoticeboard] Error:`,
      error
    );
    return { success: false, message: "Failed to update noticeboard description" };
  }
}

export async function onReorderAction(
  noticeboardId: string,
  updateData: { id: string; position: number }[]
) {
  try {
    console.log(
      `[${new Date().toISOString()} onReorderAction] noticeboardId: ${noticeboardId}, updateData:`,
      updateData
    );
    const noticeboard = await db.noticeboard.findUnique({
      where: { id: noticeboardId },
    });
    if (!noticeboard) {
      return { success: false, message: "Faculty not found" };
    }
    await db.$transaction(
      updateData.map((update) =>
        db.noticeboard.update({
          where: { id: update.id },
          data: { position: update.position },
        })
      )
    );
    return { success: true, message: "Noticeboards reordered successfully" };
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} onReorderAction] Error:`,
      error
    );
    return { success: false, message: "Failed to reorder noticeboards" };
  }
}

export async function onEditAction(noticeboardId: string, id: string) {
  try {
    console.log(
      `[${new Date().toISOString()} onEditAction] noticeboardId: ${noticeboardId}, noticeboardId: ${id}`
    );
    // const noticeboard = await db.noticeboard.findUnique({
    //   where: { id: noticeboardId },
    // });
    // if (!noticeboard) {
    //   return { success: false, message: "Faculty not found" };
    // }
    const noticeboard = await db.noticeboard.findUnique({ where: { id } });
    if (!noticeboard) {
      return { success: false, message: "Noticeboard not found" };
    }
    return { success: true, message: "Edit action triggered" };
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} onEditAction] Error:`,
      error
    );
    return { success: false, message: "Failed to trigger edit action" };
  }
}

export async function createNoticeboard(
  adminId: string,
  values: { title: string; description?: string }
) {
  try {
    console.log(
      `[${new Date().toISOString()} createNoticeboard] adminId: ${adminId}, values:`,
      values
    );
    const admin = await db.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin) {
      return { success: false, message: "Faculty not found" };
    }
    if (values.description && values.description.length > 5000) {
      return { success: false, message: "Description exceeds 5000 characters" };
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
    return {
      success: true,
      message: `Noticeboard "${noticeboard.title}" created successfully`,
    };
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} createNoticeboard] Error:`,
      error
    );
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
