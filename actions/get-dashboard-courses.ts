import { db } from "@/lib/db";
import { Course, CourseNoticeboard } from "@prisma/client";

export interface CourseWithProgressWithAdmin extends Course {
  courseNoticeboards: CourseNoticeboard[];
  progress: number | null;
  position?: number; // Mark as optional if not always present
  publishDate?: Date; // Mark as optional if not always present
}

export async function getDashboardCourses(userId: string) {
  try {
    const courses = await db.course.findMany({
      where: {
        courseNoticeboards: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        imageUrl: true,
        amount: true,
        adminId: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        position: true, // Include if in schema
        publishDate: true, // Include if in schema
        courseNoticeboards: {
          select: {
            id: true,
            isPublished: true,
          },
        },
      },
      orderBy: {
        title: "asc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithAdmin[] = courses.map(
      (course) => {
        const totalNoticeboards = course.courseNoticeboards.length;
        const completedNoticeboards = course.courseNoticeboards.filter(
          (n) => n.isPublished
        ).length;
        const progress =
          totalNoticeboards > 0
            ? (completedNoticeboards / totalNoticeboards) * 100
            : null;

        return {
          ...course,
          progress,
        };
      }
    );

    const completedCourses = coursesWithProgress.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = coursesWithProgress.filter(
      (course) => course.progress !== 100 && course.progress !== null
    );

    return { completedCourses, coursesInProgress };
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} getDashboardCourses] Error:`,
      error
    );
    return { completedCourses: [], coursesInProgress: [] };
  }
}
