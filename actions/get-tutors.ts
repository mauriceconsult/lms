import { db } from "@/lib/db";
import { Tutor, Course } from "@prisma/client";

type TutorWithCourse = Tutor & {
  course: Course | null;
  tutors: { id: string }[];
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
    const tutors = await db.tutor.findMany({
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
    const tutorsWithCourse: TutorWithCourse[] = await Promise.all(
      tutors.map(async (tutor) => {
        return {
          ...tutor,
          tutors: tutor.attachments
            ? tutor.attachments.map((a: { id: string }) => ({ id: a.id }))
            : [],
        };
      })
    );
    return tutorsWithCourse;
  } catch (error) {
    console.log("[GET_COURSENOTICEBOARDS]", error);
    return [];
  }
};
