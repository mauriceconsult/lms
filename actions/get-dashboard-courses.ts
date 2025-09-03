"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Course, Admin, Tuition, UserProgress } from "@prisma/client";

export type CourseWithProgressWithAdmin = Course & {
  admin: Admin | null;
  tutors: { id: string }[];
  progress: number | null;
  tuition: Tuition | null;
  userProgress: UserProgress[];
};

export async function getDashboardCourses(userId: string): Promise<{
  coursesInProgress: CourseWithProgressWithAdmin[];
  completedCourses: CourseWithProgressWithAdmin[];
}> {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId || clerkUserId !== userId) {
      console.log(
        `[${new Date().toISOString()} getDashboardCourses] Unauthorized userId: ${userId}`
      );
      return { coursesInProgress: [], completedCourses: [] };
    }

    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        userProgress: {
          some: { userId, isEnrolled: true },
        },
      },
      include: {
        admin: true,
        tutors: {
          select: { id: true, title: true, isFree: true, position: true, playbackId: true },
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
          select: {
            id: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
            courseId: true,
            tutorId: true,
            courseworkId: true,
            assignmentId: true,
            isEnrolled: true,
            isCompleted: true,
          },
        },
      },
      orderBy: { position: "asc" },
    });

    const coursesWithProgress: CourseWithProgressWithAdmin[] = courses.map((course) => {
      const totalTutors = course.tutors.length;
      const completedTutors = course.userProgress.filter((up) => up.isCompleted).length;
      const progress = totalTutors > 0 ? (completedTutors / totalTutors) * 100 : 0;
      return {
        ...course,
        progress,
        tuition: course.tuitions[0] || null,
        userProgress: course.userProgress,
      };
    });

    const coursesInProgress = coursesWithProgress.filter(
      (course) => course.progress !== null && course.progress < 100
    );
    const completedCourses = coursesWithProgress.filter(
      (course) => course.progress === 100
    );

    console.log(
      `[${new Date().toISOString()} getDashboardCourses] Fetched ${coursesInProgress.length} in-progress and ${completedCourses.length} completed courses for userId: ${userId}`
    );

    return { coursesInProgress, completedCourses };
  } catch (error) {
    console.error(`[${new Date().toISOString()} getDashboardCourses] Error:`, error);
    return { coursesInProgress: [], completedCourses: [] };
  }
}
