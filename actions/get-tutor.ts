import { db } from "@/lib/db";
import { Assignment, Attachment, Tutor } from "@prisma/client";

interface GetTutorProps {
  userId: string;
  courseId: string; 
  tutorId: string;
}
export const getTutor = async ({
  userId,
  courseId,  
  tutorId,
}: GetTutorProps) => {
  try {

    const tuition = await db.tuition.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        amount: true,
      },
    });
    const tutorial = await db.tutor.findUnique({
      where: {
        id: tutorId,
        isPublished: true,
      },
      include: {
        assignments: true,
        attachments: true,
      }
    });
    if (!course || !tutorial) {
      throw new Error("Admin, Course or Tutorial not found");
    }
    let muxData = null;
    let attachments: Attachment[] = [];
    let assignments: Assignment[] = [];
    let nextTutorial: Tutor | null = null;
    if (tuition) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });
      assignments = await db.assignment.findMany({
        where: {
          tutorId: tutorId,
        },
      });
    }
    if (tutorial.isFree || tuition) {
      muxData = await db.muxData.findUnique({
        where: {
          tutorId: tutorId,
        },
      });
      nextTutorial = await db.tutor.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: tutorial?.position ?? 0,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_tutorId: {
          userId,
          tutorId,
        },
      },
    });
    return {
      tutorial,
      course,   
      muxData,
      assignments,
      attachments,
      nextTutorial,
      userProgress,
      tuition,
    };
  } catch (error) {
    console.log("[GET_TUTOR_ERROR]", error);
    return {
      tutorial: null,
      course: null,      
      muxData: null,
      attachments: [],
      assignments: [],
      nextTutorial: null,
      userProgress: null,
      tuition: null,
    };
  }
};
