import { db } from "@/lib/db";

interface GetCourseNoticeboardsParams {
  title?: string;
  courseCourseCourseNoticeboardId?: string;
  courseId?: string;
  adminId?: string;
  userId?: string; // Add userId
}

export const getCourseNoticeboards = async (
  params: GetCourseNoticeboardsParams
) => {
  try {
    const {
      title,
      courseCourseCourseNoticeboardId,
      courseId,
      adminId,
      userId,
    } = params;

    const courseNoticeboards = await db.courseNoticeboard.findMany({
      where: {
        courseId,
        userId, // Add userId filter
        course: { adminId },
        ...(title && { title: { contains: title, mode: "insensitive" } }),
        ...(courseCourseCourseNoticeboardId && {
          id: courseCourseCourseNoticeboardId,
        }),
      },
      include: {
        course: {
          include: {
            courseNoticeboards: true, // For courseNoticeboardsLength
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return courseNoticeboards;
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} getCourseNoticeboards] Error:`,
      error
    );
    return [];
  }
};
