"use server";

import { db } from "@/lib/db";

interface GetProgressResult {
  course: {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    attachments: { id: string; url: string }[];
    userProgress:
      | {
          id: string;
          userId: string;
          courseId: string;
          isCompleted: boolean;
          isEnrolled: boolean;
        }[]
      | null;
  } | null;
  tutor: {
    id: string;
    title: string | null;
    attachments: { id: string; url: string }[];
    userProgress:
      | {
          id: string;
          userId: string;
          courseId: string;
          tutorId: string | null;
          isCompleted: boolean;
          isEnrolled: boolean;
        }[]
      | null;
  } | null;
  coursework: {
    id: string;
    title: string;
    attachments: { id: string; url: string }[];
    userProgress:
      | {
          id: string;
          userId: string;
          courseId: string;
          courseworkId: string | null;
          isCompleted: boolean;
          isEnrolled: boolean;
        }[]
      | null;
  } | null;
  assignment: {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    attachments: { id: string; url: string }[];
    userProgress:
      | {
          id: string;
          userId: string;
          courseId: string;
          assignmentId: string | null;
          isCompleted: boolean;
          isEnrolled: boolean;
        }[]
      | null;
  } | null;
  attachments: { id: string; url: string }[] | null;
}

export async function getProgress({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}): Promise<GetProgressResult> {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        attachments: {
          select: { id: true, url: true },
        },
        userProgress: {
          where: { userId },
          select: {
            id: true,
            userId: true,
            courseId: true,
            isCompleted: true,
            isEnrolled: true,
          },
        },
      },
    });

    const tutor = await db.tutor.findFirst({
      where: { courseId, isPublished: true },
      select: {
        id: true,
        title: true,
        attachments: {
          select: { id: true, url: true },
        },
        userProgress: {
          where: { userId },
          select: {
            id: true,
            userId: true,
            courseId: true,
            tutorId: true,
            isCompleted: true,
            isEnrolled: true,
          },
        },
      },
    });

    const coursework = await db.coursework.findFirst({
      where: { courseId },
      select: {
        id: true,
        title: true,
        attachments: {
          select: { id: true, url: true },
        },
        userProgress: {
          where: { userId },
          select: {
            id: true,
            userId: true,
            courseId: true,
            courseworkId: true,
            isCompleted: true,
            isEnrolled: true,
          },
        },
      },
    });

    const assignment = await db.assignment.findFirst({
      where: {
        tutor: { courseId }, // Filter assignments by tutor linked to courseId
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        attachments: {
          select: { id: true, url: true },
        },
        userProgress: {
          where: { userId },
          select: {
            id: true,
            userId: true,
            courseId: true,
            assignmentId: true,
            isCompleted: true,
            isEnrolled: true,
          },
        },
      },
    });

    const attachments = await db.attachment.findMany({
      where: { courseId },
      select: { id: true, url: true },
    });

    return {
      course,
      tutor,
      coursework,
      assignment,
      attachments,
    };
  } catch (error) {
    console.error(`[${new Date().toISOString()} getProgress] Error:`, error);
    return {
      course: null,
      tutor: null,
      coursework: null,
      assignment: null,
      attachments: null,
    };
  }
}
