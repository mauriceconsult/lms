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
    const faculty = await db.faculty.findUnique({
      where: {
        isPublished: true,
        id: facultyId,
      },
    });
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });
    if (!faculty || !course) {
      throw new Error("Faculty or Course not found");
    }
    let attachments: Attachment[] = [];
    let nextCourse: Course | null = null;
    if (course.isFree || userId) {
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
      faculty,
      attachments,
      nextCourse,
    };
  } catch (error) {
    console.log("[GET_COURSE_ERROR]", error);
    return {
      course: null,
      faculty: null,
      attachments: [],
      nextCourse: null,
    };
  }
};
