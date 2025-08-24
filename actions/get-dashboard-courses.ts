// actions/get-dashboard-courses.ts
"use server";

import { db } from "@/lib/db";
import {
  Course,
  Tutor,
  Tuition,
  // UserProgress,
  Admin
} from "@prisma/client";

// Suppress ESLint warnings for unused imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Attachment } from "@prisma/client";

export type CourseWithProgressWithAdmin = Course & {
  tutors: (Tutor & {
    course: Course | null;
    attachmentIds: { id: string }[];
  })[];
  userProgress: {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    isCompleted: boolean;
    courseId: string;
    tutorId: string | null;
    courseworkId: string | null;
    assignmentId: string | null;
    isEnrolled: boolean;
  }[];
  tuition?: Tuition;
  admin?: Admin;
  progress?: number;
};

export async function getDashboardCourses(userId: string) {
  try {
    const courses = await db.course.findMany({
      where: { isPublished: true },
      include: {
        tutors: {
          include: {
            course: true,
            attachments: {
              select: { id: true },
            },
          },
          orderBy: { position: "asc" },
        },
        admin: {
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
          select: {
            id: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
            isCompleted: true,
            courseId: true,
            tutorId: true,
            courseworkId: true,
            assignmentId: true,
            isEnrolled: true,
          },
        },
      },
      orderBy: { position: "asc" },
    });

    const coursesWithProgress: CourseWithProgressWithAdmin[] = courses.map(
      (course) => {
        const totalTutors = course.tutors.length;
        const completedTutors = course.userProgress.filter(
          (up) => up.isCompleted
        ).length;
        const progress =
          totalTutors > 0 ? (completedTutors / totalTutors) * 100 : 0;
        return {
          ...course,
          tutors: course.tutors.map((tutor) => ({
            ...tutor,
            attachmentIds: tutor.attachments.map((a) => ({ id: a.id })),
          })),
          progress,
          tuition: course.tuitions[0] || undefined,
          admin: course.admin || undefined,
        };
      }
    );

    return coursesWithProgress;
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} getDashboardCourses] Error:`,
      error
    );
    return [];
  }
}
