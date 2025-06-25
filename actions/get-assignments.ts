import { db } from "@/lib/db";
import { Assignment, Course } from "@prisma/client";

type AssignmentWithCourse = Assignment & {
  course: Course | null;
  assignments: { id: string }[];
};

type GetAssignments = {
  userId: string;
  title?: string;
  courseId?: string;
};
export const getAssignments = async ({
  title,
  courseId,
}: GetAssignments): Promise<AssignmentWithCourse[]> => {
  try {
    const assignments = await db.assignment.findMany({
      where: {
        isPublished: true,
        title: title ? { contains: title } : undefined,
        courseId,
      },
      include: {
        course: true,
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const assignmentsWithCourse: AssignmentWithCourse[] = await Promise.all(
      assignments.map(async (assignment) => {
        return {
          ...assignment,
          assignments: assignment.attachments
            ? assignment.attachments.map((a: { id: string }) => ({ id: a.id }))
            : [],
        };
      })
    );
    return assignmentsWithCourse;
  } catch (error) {
    console.log("[GET_ASSIGNMENTS]", error);
    return [];
  }
};
