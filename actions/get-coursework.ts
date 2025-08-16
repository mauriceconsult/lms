import { db } from "@/lib/db";
import { Attachment, Coursework } from "@prisma/client";

interface GetCourseworkProps {
  userId: string;
  courseId: string;
  courseworkId: string;
}
export const getCoursework = async ({
  userId,
  courseId,
  courseworkId,
}: GetCourseworkProps) => {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
    });
    const coursework = await db.coursework.findUnique({
      where: { id: courseworkId, isPublished: true },
    });
    if (!course || !coursework)
      throw new Error("Faculty or Coursework not found");

    let attachments: Attachment[] = [];
    let nextCoursework: Coursework | null = null;
    if (userId) {
      attachments = await db.attachment.findMany({
        where: { courseId: courseId },
      });
    }
    if (coursework.userId || userId) {
      nextCoursework = await db.coursework.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: { gt: coursework?.position ?? 0 },
        },
        orderBy: { position: "asc" },
      });
    }
    const userProgress = await db.userProgress.findUnique({
      where: { userId_courseworkId: { userId, courseworkId } },
    });
    return {
      coursework,
      courseId,
      attachments,
      nextCoursework,
      userProgress,
    };
  } catch (error) {
    console.log("[GET_COURSEWORK_ERROR]", error);
    return {
      coursework: null,
      faculty: null,
      course: null,
      attachments: [],
      nextCoursework: null,
      userProgress: null,
    };
  }
};
