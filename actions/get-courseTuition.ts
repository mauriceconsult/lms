import { db } from "@/lib/db";
import { Attachment, CourseTuition } from "@prisma/client";

interface GetCourseTuitionProps {
  userId: string;
  tuitionId: string;
  courseTuitionId: string;
}
export const getCourseTuition = async ({
  userId,
  tuitionId,
  courseTuitionId,
}: GetCourseTuitionProps) => {
  try {
    const tuition = await db.tuition.findUnique({
      where: {
        isPaid: true,
        id: tuitionId,
      },
    });
    const courseTuition = await db.courseTuition.findUnique({
      where: {
        id: courseTuitionId,
        isSubmitted: true,
        userId,
      },
    });
    if (!tuition || !courseTuition) {
      throw new Error("Tuition or Course Tuition not found");
    }
    let attachments: Attachment[] = [];
    let nextCourseTuition: CourseTuition | null = null;

    if (tuition) {
      attachments = await db.attachment.findMany({
        where: {
          tuitionId: tuitionId,
        },
      });
    }

    if (courseTuition.userId) {
      nextCourseTuition = await db.courseTuition.findFirst({
        where: {
          tuitionId: tuitionId,
          isSubmitted: true,
          position: {
            gt: courseTuition?.position ?? 0,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    return {
      courseTuition,
      tuition,
      attachments,
      nextCourseTuition,
    };
  } catch (error) {
    console.log("[GET_COURSE_TUITION_ERROR]", error);
    return {
      courseTuition: null,
      tuition: null,
      attachments: [],
      nextCourseTuition: null,
    };
  }
};
