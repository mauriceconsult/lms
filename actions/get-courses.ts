"use server";

import { Admin, Course, Tuition, UserProgress } from "@prisma/client";
import { getProgress } from "./get-progress";
import { db } from "@/lib/db";

export type CourseWithProgressWithAdmin = Course & {
  admin: Admin | null;
  tutors: { id: string }[];
  progress: number | null;
  tuition: Tuition | null;
  userProgress: UserProgress[];
};

export type GetCourses = {
  userId: string;
  title?: string;
  adminId?: string;
};

export const getCourses = async ({
  userId,
  title,
  adminId,
}: GetCourses): Promise<CourseWithProgressWithAdmin[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
          mode: "insensitive",
        },
        adminId,
      },
      include: {
        admin: true,
        tutors: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithAdmin[] = await Promise.all(
      courses.map(async (course) => {
        const progress = await getProgress(userId, course.id);
        return {
          ...course,
          progress,
          tuition: course.tuitions[0] || null,
          userProgress: course.userProgress,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
