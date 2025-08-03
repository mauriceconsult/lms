"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitCoursework(formData: {
  title: string;
  abstract: string;
  description: string;
  courseworkId: string;
  studentId: string;
}) {
  await db.studentCourseworkSubmission.create({
    data: {
      courseworkId: formData.courseworkId,
      studentId: formData.studentId,
      title: formData.title,
      abstract: formData.abstract,
      description: formData.description,
    },
  });
  revalidatePath(`/faculties/[facultyId]/courseworks/[courseworkId]/submitted`);
}
