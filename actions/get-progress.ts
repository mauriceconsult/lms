import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  id: string,
  type: "course" | "coursework" | "assignment" | "tutor"
): Promise<number> => {
  try {
    let completedCount = 0;
    let totalCount = 0;

    if (type === "course") {
      const publishedAssignments = await db.assignment.findMany({
        where: { courseId: id, isPublished: true },
        select: { id: true },
      });
      const publishedTutors = await db.tutor.findMany({
        where: { courseId: id, isPublished: true },
        select: { id: true },
      });
      const assignmentIds = publishedAssignments.map(
        (assignment) => assignment.id
      );
      const tutorIds = publishedTutors.map((tutor) => tutor.id);
      totalCount = assignmentIds.length + tutorIds.length;
      completedCount = await db.userProgress.count({
        where: {
          userId,
          OR: [
            { assignmentId: { in: assignmentIds } },
            { tutorId: { in: tutorIds } },
          ],
          isCompleted: true,
        },
      });
    } else if (type === "coursework") {
      totalCount = 1;
      completedCount = await db.userProgress.count({
        where: { userId, courseworkId: id, isCompleted: true },
      });
    } else if (type === "assignment") {
      totalCount = 1;
      completedCount = await db.userProgress.count({
        where: { userId, assignmentId: id, isCompleted: true },
      });
    } else if (type === "tutor") {
      totalCount = 1;
      completedCount = await db.userProgress.count({
        where: { userId, tutorId: id, isCompleted: true },
      });
    }

    return totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
