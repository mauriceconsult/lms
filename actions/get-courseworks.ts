import { db } from "@/lib/db";
import { Coursework, Faculty, Attachment } from "@prisma/client";

type CourseworkWithRelations = Coursework & {
  faculty: Faculty | null;
  attachments: Attachment[];
};

type GetCourseworks = {
  userId: string;
  title?: string;
  facultyId?: string;
};
export const getCourseworks = async ({
  title,
  facultyId,
}: GetCourseworks): Promise<CourseworkWithRelations[]> => {
  try {
    const courseworks = await db.coursework.findMany({
      where: {
        isPublished: true,
        title: title ? { contains: title } : undefined,
        facultyId,
      },
      include: {
        faculty: true,
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
