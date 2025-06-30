import { db } from "@/lib/db";
import { Tuition, Course } from "@prisma/client";

type TuitionWithCourse = Tuition & {
  course: Course | null;
  tuitions: { id: string }[];
};

type GetTuitions = {
  userId: string;
  title?: string;
  courseId?: string;
};
export const getTuitions = async ({
  title,
  courseId,
}: GetTuitions): Promise<TuitionWithCourse[]> => {
  try {
    const tuitions = await db.tuition.findMany({
      where: {
        isPaid: true,
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
    const tuitionsWithCourse: TuitionWithCourse[] = await Promise.all(
      tuitions.map(async (tuition) => {
        return {
          ...tuition,
          tuitions: tuition.attachments
            ? tuition.attachments.map((a: { id: string }) => ({ id: a.id }))
            : [],
        };
      })
    );
    return tuitionsWithCourse;
  } catch (error) {
    console.log("[GET_ASSIGNMENTS]", error);
    return [];
  }
};
