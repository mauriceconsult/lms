// app/payroll/create-payroll/[payrollId]/actions.ts
"use server";

import { db } from "@/lib/db"; // Adjust path to your Prisma client

export async function onReorderAction(
  payrollId: string,
  updateData: { id: string; position: number }[]
) {
  try {
    await db.$transaction(
      updateData.map((update) =>
        db.adminPayroll.update({
          where: { id: update.id },
          data: { position: update.position },
        })
      )
    );
    return { success: true, message: "Faculty Payrolls reordered" };
  } catch (error) {
    console.error("[REORDER_ACTION]", error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function onEditAction(payrollId: string, id: string) {
  // Implement edit logic (e.g., redirect or update)
  // For now, log and return success (adjust as needed)
  console.log(`Editing payroll item ${id} for payroll ${payrollId}`);
  return { success: true, message: "Edit action triggered" };
}

export async function createFacultyPayroll(
  payrollId: string,
  values: { title: string }
) {
  try {
    await db.adminPayroll.create({
      data: {
        title: values.title,
        payrollId,
        userId: payrollId, // Adjust based on your schema
        adminId: "default-admin-id", // Adjust based on your schema
        position: 0, // Adjust as needed
        isPaid: false,        
      },
    });
    return { success: true, message: "Faculty payroll created" };
  } catch (error) {
    console.error("[CREATE_FACULTY_PAYROLL]", error);
    return { success: false, message: "Something went wrong" };
  }
}
