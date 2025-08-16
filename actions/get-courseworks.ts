import { db } from "@/lib/db";
import { Coursework, Attachment, Course } from "@prisma/client";

type CourseworkWithRelations = Coursework & {
  course: Course | null;
  attachments: Attachment[];
};

type GetCourseworks = {
  userId: string;
  title?: string;
  courseId?: string;
};
export const getCourseworks = async ({
  title,
  courseId,
}: GetCourseworks): Promise<CourseworkWithRelations[]> => {
  try {
    const courseworks = await db.coursework.findMany({
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
        createdAt: "desc"
      }
    });
    return courseworks;
  } catch (error) {
    console.log("[GET_COURSEWORKS]", error);
    return [];
  }
};
