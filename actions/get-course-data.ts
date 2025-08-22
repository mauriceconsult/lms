"use server";

import { db } from "@/lib/db";
import { CourseWithProgressWithFaculty } from "@/actions/get-dashboard-courses";

export async function getCourseData(courseId: string, userId: string): Promise<CourseWithProgressWithFaculty | null> {
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} getCourseData] No userId, returning null`
    );
    return null;
  }

  if (!courseId || typeof courseId !== "string") {
    console.log(
      `[${new Date().toISOString()} getCourseData] Invalid courseId, returning null`
    );
    return null;
  }

  try {
    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
      include: {
        tutors: {
          select: { id: true, title: true, isFree: true, position: true, playbackId: true },
          orderBy: { position: "asc" },
        },
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
    });

    if (!course) {
      console.log(
        `[${new Date().toISOString()} getCourseData] Course not found for courseId: ${courseId}`
      );
      return null;
    }

    const totalTutors = course.tutors.length;
    const completedTutors = course.userProgress.filter((up) => up.isCompleted).length;
    const progress = totalTutors > 0 ? (completedTutors / totalTutors) * 100 : 0;

    const courseWithProgress: CourseWithProgressWithFaculty = {
      ...course,
      progress,
      tuition: course.tuitions[0] || null,
      userProgress: course.userProgress,
    };

    console.log(`[${new Date().toISOString()} getCourseData] Course response:`, {
      courseId,
      title: course.title,
      isEnrolled: course.userProgress[0]?.isEnrolled || false,
      isPaid: course.tuitions[0]?.isPaid || false,
      progress,
      tutors: course.tutors.map((t) => ({ id: t.id, title: t.title, isFree: t.isFree })),
    });

    return courseWithProgress;
  } catch (error) {
    console.error(`[${new Date().toISOString()} getCourseData] Error:`, error);
    return null;
  }
}
