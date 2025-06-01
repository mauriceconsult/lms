import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedTutors = await db.tutor.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });
    const publishedTutorsIds = publishedTutors.map((tutor) => tutor.id);
    const validCompletedTutors = await db.userProgress.count({
      where: {
        userId: userId,
        tutorId: {
          in: publishedTutorsIds,},
        isCompleted: true,
      },
    });
    const progressPercentage =
      (validCompletedTutors / publishedTutorsIds.length) * 100;
    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
