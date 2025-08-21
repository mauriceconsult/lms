import { db } from "@/lib/db";

export async function getProgress(
  userId: string,
  courseId: string
): Promise<number | null> {
  try {
    const completedContent = await db.content.findMany({
      where: {
        courseId,
        userId,
        isCompleted: true,
      },
      select: { id: true },
    });

    const totalContent = await db.content.findMany({
      where: { courseId },
      select: { id: true },
    });

    if (totalContent.length === 0) {
      return null;
    }

    return (completedContent.length / totalContent.length) * 100;
  } catch (error) {
    console.error(`[${new Date().toISOString()} GET_PROGRESS]`, error);
    return null;
  }
}
