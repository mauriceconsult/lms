"use server";

import { CourseWithProgressWithAdmin } from "@/app/(eduplat)/types/course";
import { db } from "@/lib/db";
// import { CourseWithProgressWithAdmin } from "@/types/course";

export async function getDashboardCourses(userId: string): Promise<{
  completedCourses: CourseWithProgressWithAdmin[];
  coursesInProgress: CourseWithProgressWithAdmin[];
}> {
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} getDashboardCourses] No userId, returning empty arrays`
    );
    return { completedCourses: [], coursesInProgress: [] };
  }

  try {
    console.time("getDashboardCoursesQuery"); // Static label
    const courses = await db.course.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        imageUrl: true,
        amount: true,
        position: true,
        isPublished: true,
        facultyId: true,
        publishDate: true,
        createdAt: true,
        updatedAt: true,
        faculty: {
          select: {
            id: true,
            title: true,
            userId: true,
            description: true,
            imageUrl: true,
            position: true,
            isPublished: true,
            createdAt: true,
            updatedAt: true,
            schoolId: true,
          },
        },
        tutors: {
          select: { id: true, title: true, isFree: true, position: true, playbackId: true },
          orderBy: { position: "asc" },
        },
        tuitions: {
          where: { userId },
          select: {
            id: true,
            userId: true,
            courseId: true,
            amount: true,
            status: true,
            partyId: true,
            username: true,
            transactionId: true,
            isActive: true,
            isPaid: true,
            transId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        userProgress: {
          where: { userId },
          select: { isCompleted: true, isEnrolled: true, tutorId: true },
        },
      },
      orderBy: { position: "asc" },
    });
    console.timeEnd("getDashboardCoursesQuery"); // Match static label

    const coursesWithProgress: CourseWithProgressWithAdmin[] = courses.map((course) => {
      const totalTutors = course.tutors.length;
      const completedTutors = course.userProgress.filter((up) => up.isCompleted).length;
      const progress = totalTutors > 0 ? (completedTutors / totalTutors) * 100 : 0;
      const tuition = course.tuitions[0]
        ? {
            ...course.tuitions[0],
            amount: course.tuitions[0].amount,
          }
        : null;
      return {
        ...course,
        progress,
        tuition,
        userProgress: course.userProgress,
        admin: course.faculty,
      };
    });

    const completedCourses = coursesWithProgress.filter((course) => course.progress === 100);
    const coursesInProgress = coursesWithProgress.filter((course) => course.progress !== 100);

    console.log(`[${new Date().toISOString()} getDashboardCourses] Courses response:`, {
      userId,
      completedCourses: completedCourses.map((c) => ({ id: c.id, title: c.title, progress: c.progress })),
      coursesInProgress: coursesInProgress.map((c) => ({ id: c.id, title: c.title, progress: c.progress })),
    });

    return { completedCourses, coursesInProgress };
  } catch (error) {
    console.error(`[${new Date().toISOString()} getDashboardCourses] Error:`, error);
    return { completedCourses: [], coursesInProgress: [] };
  }
}
