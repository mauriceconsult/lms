import { db } from "@/lib/db";

export async function getProgress(
  userId: string,
  courseId: string
): Promise<number | null> {
  if (
    !userId ||
    typeof userId !== "string" ||
    !courseId ||
    typeof courseId !== "string"
  ) {
    console.error(
      `[${new Date().toISOString()} GET_PROGRESS] Invalid arguments:`,
      { userId, courseId }
    );
    return null;
  }

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
    console.error(`[${new Date().toISOString()} GET_PROGRESS] Error:`, {
      userId,
      courseId,
      error,
    });
    return null;
  }
}
