import { db } from "@/lib/db";
import { Attachment, TutorAssignment } from "@prisma/client";

interface GetTutorAssignmentProps {
  userId: string;
  assignmentId: string;
  tutorAssignmentId: string;
}
export const getTutorAssignment = async ({
  userId,
  assignmentId,
  tutorAssignmentId,
}: GetTutorAssignmentProps) => {
  try {
    const assignment = await db.assignment.findUnique({
      where: {
        isPublished: true,
        id: assignmentId,
      },
    });
    const tutorAssignment = await db.tutorAssignment.findUnique({
      where: {
        id: tutorAssignmentId,
        isSubmitted: true,
      },
    });
    if (!assignment || !tutorAssignment) {
      throw new Error("Faculty or TutorAssignment not found");
    }
    let attachments: Attachment[] = [];
    let nextTutorAssignment: TutorAssignment | null = null;
    if (userId) {
      attachments = await db.attachment.findMany({
        where: {
          tutorAssignmentId: tutorAssignmentId,
        },
      });
      nextTutorAssignment = await db.tutorAssignment.findFirst({
        where: {
          assignmentId: assignmentId,
          isSubmitted: true,
          position: {
            gt: tutorAssignment?.position ?? 0,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }
    return {
      assignment,
      tutorAssignment,
      attachments,
      nextTutorAssignment,
    };
  } catch (error) {
    console.log("[GET_TUTOR_ASSIGNMENT_ERROR]", error);
    return {
      tutorAssignment: null,
      assignment: null,
      attachments: [],
      nextTutorAssignment: null,
    };
  }
};
