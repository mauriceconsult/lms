import { db } from "@/lib/db";
import { Attachment, Course } from "@prisma/client";

interface GetCourseProps {
  userId: string;
  facultyId: string;
  courseId: string;
}
export const getCourse = async ({
  userId,
  facultyId,
  courseId,
}: GetCourseProps) => {
  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });
    if (!facultyId || !course) {
      throw new Error("Faculty or Course not found");
    }
    let attachments: Attachment[] = [];
    let nextCourse: Course | null = null;
    if (userId) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });
      nextCourse = await db.course.findFirst({
        where: {
          facultyId: facultyId,
          isPublished: true,
          position: {
            gt: course?.position ?? 0,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }
    return {
      course,
      attachments,
      nextCourse,
    };
  } catch (error) {
    console.log("[GET_COURSE_ERROR]", error);
    return {
      course: null,      
      attachments: [],
      nextCourse: null,
    };
  }
};
