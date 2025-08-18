import { db } from "@/lib/db";
import { Assignment, Attachment, Tutor } from "@prisma/client";

type AssignmentWithRelations = Assignment & {
  tutor: Tutor | null;
  attachments: Attachment[];
};

type GetAssignments = {
  userId: string;
  title?: string;
  tutorId?: string;
};
export const getAssignments = async ({
  title,
  tutorId,
}: GetAssignments): Promise<AssignmentWithRelations[]> => {
  try {
    const assignments = await db.assignment.findMany({
      where: {
        isPublished: true,
        title: title ? { contains: title } : undefined,
        tutorId,
      },
      include: {
        tutor: true,
        attachments: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return assignments;
  } catch (error) {
    console.log("[GET_ASSIGNMENTS]", error);
    return [];
  }
};
