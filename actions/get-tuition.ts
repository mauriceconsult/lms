import { db } from "@/lib/db";
import { Attachment, Tuition } from "@prisma/client";

interface GetTuitionProps {
  userId: string;
  courseId: string;
  tuitionId: string;
}
export const getTuition = async ({
  userId,
  courseId,
  tuitionId,
}: GetTuitionProps) => {
  try {   
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },   
    });
    const tuition = await db.tuition.findUnique({
      where: {
        id: tuitionId,
        isPaid: true,
      },
    });
    if (!course || !tuition) {
      throw new Error("Course or Tuition not found");
    }
    let attachments: Attachment[] = [];
    let nextTuition: Tuition | null = null;
    if (userId) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });
    }
    if (tuition.userId || userId) {    
      nextTuition = await db.tuition.findFirst({
        where: {
          courseId: courseId,
          isPaid: true,
          position: {
            gt: tuition?.position ?? 0,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    return {
      tuition,
      course,      
      attachments,
      nextTuition,  
    };
  } catch (error) {
    console.log("[GET_TUTOR_ERROR]", error);
    return {
      tuition: null,
      course: null,      
      attachments: [],
      nextTuition: null,     
    };
  }
};
