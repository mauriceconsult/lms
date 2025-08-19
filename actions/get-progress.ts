import { db } from "@/lib/db";
import { Attachment } from "@prisma/client";

interface GetProgressProps {
  userId: string;
  courseId: string;
}

interface GetProgressResult {
  course: {
    id: string;
    title: string;
    description?: string | null;
    createdAt: Date;
    userProgress: {
      id: string;
      userId: string;
      courseId: string;
      tutorId?: string | null;
      courseworkId?: string | null;
      assignmentId?: string | null;
      isCompleted: boolean;
      isEnrolled: boolean;
    }[];
    attachments: Attachment[];
  } | null;
  tutor: {
    id: string;
    title: string | null;
    userProgress: {
      id: string;
      userId: string;
      courseId: string;
      tutorId: string;
      courseworkId?: string | null;
      assignmentId?: string | null;
      isCompleted: boolean;
      isEnrolled: boolean;
    }[];
    attachments: Attachment[];
  } | null;
  coursework: {
    id: string;
    title: string;
    userProgress: {
      id: string;
      userId: string;
      courseId: string;
      tutorId?: string | null;
      courseworkId: string;
      assignmentId?: string | null;
      isCompleted: boolean;
      isEnrolled: boolean;
    }[];
    attachments: Attachment[];
  } | null;
  assignment: {
    id: string;
    title: string;
    description?: string | null;
    createdAt: Date;
    userProgress: {
      id: string;
      userId: string;
      courseId: string;
      tutorId?: string | null;
      courseworkId?: string | null;
      assignmentId: string;
      isCompleted: boolean;
      isEnrolled: boolean;
    }[];
    attachments: Attachment[];
  } | null;
  attachments: Attachment[];
}

export const getProgress = async ({
  userId,
  courseId,
}: GetProgressProps): Promise<GetProgressResult | { error: string }> => {
  try {
    // Validate inputs
    if (
      !userId ||
      !courseId ||
      [userId, courseId].some(
        (id) => typeof id !== "string" || id.trim() === ""
      )
    ) {
      return { error: "Invalid or missing required parameters" };
    }

    // Fetch data concurrently with included attachments and userProgress
    const [course, tutors, coursework, assignments] = await Promise.all([
      db.course.findUnique({
        where: {
          id: courseId,
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          attachments: {
            select: {
              id: true,
              url: true,
              createdAt: true,
              updatedAt: true,
              courseId: true,
              facultyId: true,
              tutorId: true,
              assignmentId: true,
              courseworkId: true,
              noticeboardId: true,
              courseNoticeboardId: true,
              tuitionId: true,
              payrollId: true,
              facultyPayrollId: true,
            },
          },
          userProgress: {
            where: { userId },
            select: {
              id: true,
              userId: true,
              courseId: true,
              tutorId: true,
              courseworkId: true,
              assignmentId: true,
              isCompleted: true,
              isEnrolled: true,
            },
          },
        },
      }),
      db.tutor.findMany({
        where: {
          courseId,
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          attachments: {
            select: {
              id: true,
              url: true,
              createdAt: true,
              updatedAt: true,
              courseId: true,
              facultyId: true,
              tutorId: true,
              assignmentId: true,
              courseworkId: true,
              noticeboardId: true,
              courseNoticeboardId: true,
              tuitionId: true,
              payrollId: true,
              facultyPayrollId: true,
            },
          },
          userProgress: {
            where: { userId },
            select: {
              id: true,
              userId: true,
              courseId: true,
              tutorId: true,
              courseworkId: true,
              assignmentId: true,
              isCompleted: true,
              isEnrolled: true,
            },
          },
        },
      }),
      db.coursework.findMany({
        where: {
          courseId,
          isPublished: true,
          userId,
        },
        select: {
          id: true,
          title: true,
          attachments: {
            select: {
              id: true,
              url: true,
              createdAt: true,
              updatedAt: true,
              courseId: true,
              facultyId: true,
              tutorId: true,
              assignmentId: true,
              courseworkId: true,
              noticeboardId: true,
              courseNoticeboardId: true,
              tuitionId: true,
              payrollId: true,
              facultyPayrollId: true,
            },
          },
          userProgress: {
            where: { userId },
            select: {
              id: true,
              userId: true,
              courseId: true,
              tutorId: true,
              courseworkId: true,
              assignmentId: true,
              isCompleted: true,
              isEnrolled: true,
            },
          },
        },
      }),
      db.assignment.findMany({
        where: {
          // tutorId,
          isPublished: true,
          userId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          attachments: {
            select: {
              id: true,
              url: true,
              createdAt: true,
              updatedAt: true,
              courseId: true,
              facultyId: true,
              tutorId: true,
              assignmentId: true,
              courseworkId: true,
              noticeboardId: true,
              courseNoticeboardId: true,
              tuitionId: true,
              payrollId: true,
              facultyPayrollId: true,
            },
          },
          userProgress: {
            where: { userId },
            select: {
              id: true,
              userId: true,
              courseId: true,
              tutorId: true,
              courseworkId: true,
              assignmentId: true,
              isCompleted: true,
              isEnrolled: true,
            },
          },
        },
      }),
    ]);

    // Check for missing entities
    if (!course) {
      return { error: "Course not found" };
    }

    // Select the first tutor and coursework for simplicity (or adjust based on your needs)
    const tutor = tutors[0] || null;
    const courseworkItem = coursework[0] || null;
    const assignment = assignments[0] || null;

    // Combine attachments from course, tutor, coursework, and assignment
    const attachments = [
      ...(course.attachments || []),
      ...(tutor?.attachments || []),
      ...(courseworkItem?.attachments || []),
      ...(assignment?.attachments || []),
    ];

    console.debug("[GET_USER_PROGRESS_SUCCESS]", {
      userId,
      courseId,
    });

    return {
      course,
      tutor,
      coursework: courseworkItem,
      assignment,
      attachments,
    };
  } catch (error) {
    console.error("[GET_USER_PROGRESS_ERROR]", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      userId,
      courseId,
    });
    return { error: "Failed to fetch progress data" };
  }
};
