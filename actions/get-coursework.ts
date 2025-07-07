import { db } from "@/lib/db";
import { Attachment, Coursework } from "@prisma/client";

interface GetCourseworkProps {
  userId: string;
  facultyId: string;
  courseworkId: string;
}
export const getCoursework = async ({
  userId,
  facultyId,
  courseworkId,
}: GetCourseworkProps) => {
  try {   
    const faculty = await db.faculty.findUnique({
      where: {
        isPublished: true,
        id: facultyId,
      },   
    });
    const coursework = await db.coursework.findUnique({
      where: {
        id: courseworkId,
        isPublished: true,
      },
    });
    if (!faculty || !coursework) {
      throw new Error("Course or Coursework not found");
    }
    let attachments: Attachment[] = [];
    let nextCoursework: Coursework | null = null;
    if (userId) {
      attachments = await db.attachment.findMany({
        where: {
          facultyId: faculty.id,
        },
      });
    }
    if (coursework.userId || userId) {    
      nextCoursework = await db.coursework.findFirst({
        where: {
          facultyId: faculty.id,
          isPublished: true,
          position: {
            gt: coursework?.position ?? 0,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_courseworkId: {
          userId,
          courseworkId,
        },
      },
    });
    return {
      coursework,
      faculty,      
      attachments,
      nextCoursework,
      userProgress,    
    };
  } catch (error) {
    console.log("[GET_TUTOR_ERROR]", error);
    return {
      coursework: null,
      faculty: null,      
      attachments: [],
      nextCoursework: null,
      userProgress: null,      
    };
  }
};
