"use server";

import { db } from "@/lib/db";
import { Coursework } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createCoursework(formData: FormData) {
  const facultyId = formData.get("facultyId") as string;
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const faculty = await db.faculty.findUnique({ where: { id: facultyId } });
  if (!faculty || faculty.createdBy !== userId) throw new Error("Forbidden");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const courseId = formData.get("courseId") as string;

  const generatedId = uuidv4();
  console.log("Generated ID (raw UUID):", generatedId);

  const coursework = await db.$transaction(async (tx) => {
    const result = await tx.coursework.create({
      data: {
        id: generatedId,
        userId: userId,
        facultyId,
        courseId,
        title,
        description,
        createdBy: userId, // Use userId as String
      },
    });
    return result as Coursework;
  });

  console.log("Forced coursework ID after create:", coursework.id);
  redirect(`/faculties/${facultyId}/courseworks/${coursework.id}`);
}
