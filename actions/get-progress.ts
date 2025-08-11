import { db } from "@/lib/db";
import { Attachment } from "@prisma/client";

interface GetProgressProps {
  userId: string;
  courseId: string;
  tutorId: string;
  courseworkId: string;
  assignmentId: string;
}

interface GetProgressResult {
  course: {
    id: string;
    title: string;
    description?: string | null;
    createdAt: Date;
    amount?: string | null;
    faculty?: string | null;
    attachments: Attachment[];
  } | null;
  tutor: {
    id: string;
    title: string | null; // Allow null to match schema
    attachments: Attachment[];
  } | null;
  coursework: {
    id: string;
    title: string;
    attachments: Attachment[];
  } | null;
  userProgress: {
    id: string;
    userId: string;
    completed?: boolean;
  } | null;
  attachments: Attachment[];
}

export const getProgress = async ({
  userId,
  courseId,
  tutorId,
  courseworkId,
  assignmentId,
}: GetProgressProps): Promise<GetProgressResult | { error: string }> => {
  try {
    // Validate inputs
    if (
      !userId ||
      !courseId ||
      !tutorId ||
      !courseworkId ||
      !assignmentId ||
      [userId, courseId, tutorId, courseworkId, assignmentId].some(
        (id) => typeof id !== "string" || id.trim() === ""
      )
    ) {
      return { error: "Invalid or missing required parameters" };
    }

    // Fetch data concurrently with included attachments
    const [assignment, course, coursework, tutor, userProgress] =
      await Promise.all([
        db.assignment.findUnique({
          where: {
            userId,
            isPublished: true,
            tutorId,
            id: assignmentId,
          },
          select: {
            id: true,
            title: true,
            attachments: {
              select: {
                id: true,
                // name: true,
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
          },
        }),
        db.course.findUnique({
          where: {
            isPublished: true,
            id: courseId,
          },
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            amount: true,
            faculty: {
              select: {
                title: true, // Or name, depending on schema
              },
            },
            attachments: {
              // Added attachments
              select: {
                id: true,
                // name: true,
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
          },
        }),
        db.coursework.findUnique({
          where: {
            userId,
            id: courseworkId,
            isPublished: true,
            courseId,
          },
          select: {
            id: true,
            title: true,
            attachments: {
              select: {
                id: true,
                // name: true,
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
          },
        }),
        db.tutor.findUnique({
          where: {
            id: tutorId,
            isPublished: true,
          },
          select: {
            id: true,
            title: true,
            attachments: {
              select: {
                id: true,
                // name: true,
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
          },
        }),
        db.userProgress.findUnique({
          where: {
            userId_tutorId: {
              userId,
              tutorId,
            },
          },
          select: {
            id: true,
            userId: true,
            isCompleted: true,
          },
        }),
      ]);

    // Check for missing entities
    if (!coursework || !course || !assignment || !tutor) {
      const missingEntities = [];
      if (!coursework) missingEntities.push("coursework");
      if (!course) missingEntities.push("course");
      if (!assignment) missingEntities.push("assignment");
      if (!tutor) missingEntities.push("tutor");
      return { error: `Missing entities: ${missingEntities.join(", ")}` };
    }

    // Combine attachments from assignment, coursework, and tutor
    const attachments = [
      ...(assignment.attachments || []),
      ...(coursework.attachments || []),
      ...(course.attachments || []),
      ...(tutor.attachments || []),
    ];

    console.debug("[GET_USER_PROGRESS_SUCCESS]", {
      userId,
      courseId,
      tutorId,
      courseworkId,
      assignmentId,
    });

    return {
      tutor,
      course: course
        ? {
            ...course,
            faculty: course.faculty?.title || null,
          }
        : null,
      coursework,
      attachments,
      userProgress,
    };
  } catch (error) {
    console.error("[GET_USER_PROGRESS_ERROR]", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      userId,
      courseId,
      tutorId,
      courseworkId,
      assignmentId,
    });
    return { error: "Failed to fetch progress data" };
  }
};
