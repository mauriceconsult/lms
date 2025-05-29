import { db } from "@/lib/db";

export const getProgress = async (
    userId: string,
    courseId: string,
): Promise<number> => {
    try {
        const publishedTopics = await db.tutor.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
            select: {
                id: true,
            }
        });
        const publishedTopicsIds = publishedTopics.map((tutor) => tutor.id);
        const validCompletedTopics = await db.userProgress.count({
            where: {
                userId: userId,
                tutorId: {
                    in: publishedTopicsIds,
                },
                isCompleted: true
            }
        });
        const progressPercentage = (validCompletedTopics / publishedTopicsIds.length) * 100;
        return progressPercentage
    } catch (error) {
        console.log("[GET_PROGRESS", error);
        return 0;

    }
}