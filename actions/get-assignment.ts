import { db } from "@/lib/db";
import { Attachment, Assignment } from "@prisma/client";

interface GetAssignmentProps {
  userId: string;
  courseId: string;
  assignmentId: string;
}
export const getAssignment = async ({
  userId,
  courseId,
  assignmentId,
}: GetAssignmentProps) => {
  try {   
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },   
    });
    const assignment = await db.assignment.findUnique({
      where: {
        id: assignmentId,
        isPublished: true,
      },
    });
    if (!course || !assignment) {
      throw new Error("Course or Assignment not found");
    }
    let attachments: Attachment[] = [];
    let nextAssignment: Assignment | null = null;
    if (userId) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });
    }
    if (assignment.userId || userId) {    
      nextAssignment = await db.assignment.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: assignment?.position ?? 0,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_assignmentId: {
          userId,
          assignmentId,
        },
      },
    });
    return {
      assignment,
      course,      
      attachments,
      nextAssignment,
      userProgress,    
    };
  } catch (error) {
    console.log("[GET_TUTOR_ERROR]", error);
    return {
      assignment: null,
      course: null,      
      attachments: [],
      nextAssignment: null,
      userProgress: null,      
    };
  }
};
