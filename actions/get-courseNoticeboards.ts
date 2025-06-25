import { db } from "@/lib/db";
import { CourseNoticeboard, Course } from "@prisma/client";

type CourseNoticeboardWithCourse = CourseNoticeboard & {
  course: Course | null;
  courseNoticeboards: { id: string }[];
};

type GetCourseNoticeboards = {
  userId: string;
  title?: string;
  courseId?: string;
};
export const getCourseNoticeboards = async ({
  title,
  courseId,
}: GetCourseNoticeboards): Promise<CourseNoticeboardWithCourse[]> => {
  try {
    const courseNoticeboards = await db.courseNoticeboard.findMany({
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
    const courseNoticeboardsWithCourse: CourseNoticeboardWithCourse[] = await Promise.all(
      courseNoticeboards.map(async (courseNoticeboard) => {
        return {
          ...courseNoticeboard,
          courseNoticeboards: courseNoticeboard.attachments
            ? courseNoticeboard.attachments.map((a: { id: string }) => ({ id: a.id }))
            : [],
        };
      })
    );
    return courseNoticeboardsWithCourse;
  } catch (error) {
    console.log("[GET_COURSENOTICEBOARDS]", error);
    return [];
  }
};
