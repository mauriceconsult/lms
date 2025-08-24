// actions/get-course-data.ts
"use server";

import { db } from "@/lib/db";
import { Course, Tutor, Tuition, Admin } from "@prisma/client";

// Suppress ESLint warnings for unused imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UserProgress } from "@prisma/client";
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

export async function getCourseData(
  courseId: string,
  userId: string
): Promise<CourseWithProgressWithAdmin | null> {
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
    });

    if (!course) {
      console.log(
        `[${new Date().toISOString()} getCourseData] Course not found for courseId: ${courseId}`
      );
      return null;
    }

    const totalTutors = course.tutors.length;
    const completedTutors = course.userProgress.filter(
      (up) => up.isCompleted
    ).length;
    const progress =
      totalTutors > 0 ? (completedTutors / totalTutors) * 100 : 0;

    const courseWithProgress: CourseWithProgressWithAdmin = {
      ...course,
      tutors: course.tutors.map((tutor) => ({
        ...tutor,
        attachmentIds: tutor.attachments.map((a) => ({ id: a.id })),
      })),
      progress,
      tuition: course.tuitions[0] || undefined,
      admin: course.admin || undefined,
    };

    console.log(
      `[${new Date().toISOString()} getCourseData] Course response:`,
      {
        courseId,
        title: course.title,
        isEnrolled: course.userProgress[0]?.isEnrolled || false,
        isPaid: course.tuitions[0]?.isPaid || false,
        progress,
        tutors: course.tutors.map((t) => ({
          id: t.id,
          title: t.title,
          isFree: t.isFree,
          attachmentIds: t.attachments.map((a) => a.id),
        })),
      }
    );

    return courseWithProgress;
  } catch (error) {
    console.error(`[${new Date().toISOString()} getCourseData] Error:`, error);
    return null;
  }
}
