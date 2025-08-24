// actions/get-tutors.ts
import { db } from "@/lib/db";
import { Tutor, Course } from "@prisma/client";

type TutorWithCourse = Tutor & {
  course: Course | null;
  attachmentIds: { id: string }[];
};

type GetTutors = {
  userId: string;
  title?: string;
  courseId?: string;
};

export const getTutors = async ({
  title,
  courseId,
}: GetTutors): Promise<TutorWithCourse[]> => {
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
    const tutorialsWithCourse: TutorWithCourse[] = tutorials.map((tutor) => ({
      ...tutor,
      attachmentIds: tutor.attachments.map((a) => ({ id: a.id })),
    }));
    return tutorialsWithCourse;
  } catch (error) {
    console.log("[GET_TUTORS]", error);
    return [];
  }
};
