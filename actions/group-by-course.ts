import { Tuition, Course } from "@prisma/client";

export type TuitionWithCourse = Tuition & { course: Course | null };

export const groupByCourse = (tuitions: TuitionWithCourse[]) => {
  return tuitions.reduce((acc, tuition) => {
    if (!tuition.course) return acc; // Skip if course is null
    const title = tuition.course.title;
    const amount = parseFloat(tuition.amount ?? "0");
    if (isNaN(amount)) return acc;
    acc[title] = (acc[title] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);
};
