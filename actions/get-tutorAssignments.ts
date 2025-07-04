import { db } from "@/lib/db";
import { TutorAssignment, Assignment, Attachment } from "@prisma/client";

type TutorAssignmentWithRelations = TutorAssignment & {
  assignment: Assignment | null;
  attachments: Attachment[];
};

type GetTutorAssignments = {
  userId: string;
  title?: string;
  assignmentId?: string;
};
export const getTutorAssignments = async ({
  title,
  assignmentId,
}: GetTutorAssignments): Promise<TutorAssignmentWithRelations[]> => {
  try {
    const tutorAssignments = await db.tutorAssignment.findMany({
      where: {
        isSubmitted: true,
        title: title ? { contains: title } : undefined,
        assignmentId,
      },
      include: {
        assignment: true,
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return tutorAssignments;
  } catch (error) {
    console.log("[GET_TUTOR_ASSIGNMENTS]", error);
    return [];
  }
};
