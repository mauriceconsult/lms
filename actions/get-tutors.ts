import { db } from "@/lib/db";
import { Tutor, Course } from "@prisma/client";

export type TutorialWithCourse = Tutor & {
  course: Course | null;
  attachmentIds: { id: string }[];
};

export type GetTutors = {
  userId: string;
  title?: string;
  courseId?: string;
};

export const getTutors = async ({
  title,
  courseId,
}: GetTutors): Promise<TutorialWithCourse[]> => {
  try {
    const tutorials = await db.tutor.findMany({
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
        createdAt: "desc",
      },
    });
    const tutorialsWithCourse: TutorialWithCourse[] = tutorials.map((tutorial) => ({
      ...tutorial,
      attachmentIds: tutorial.attachments.map((a) => ({ id: a.id })),
    }));
    return tutorialsWithCourse;
  } catch (error) {
    console.log("[GET_TUTORIALS]", error);
    return [];
  }
};
