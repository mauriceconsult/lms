import { db } from "@/lib/db";
import { Course, Faculty, Tuition } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithProgressWithFaculty = Course & {
  faculty: Faculty | null;
  tutors: { id: string; title: string }[];
  progress: number | null;
  tuition: Tuition | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithFaculty[];
  coursesInProgress: CourseWithProgressWithFaculty[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.tuition.findMany({
      where: {
        userId,
        status: { in: ["pending", "completed"] },
      },
      select: {
        course: {
          include: {
            faculty: true,
            tutors: {
              select: { id: true, title: true },
              where: { isPublished: true },
            },
          },
        },
        id: true,
        userId: true,
        courseId: true,
        amount: true,
        transactionId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        transId: true,
        partyId: true, // Added
        username: true, // Added
        isActive: true, // Added
        isPaid: true, // Added
      },
    });

    const courses: CourseWithProgressWithFaculty[] = await Promise.all(
      purchasedCourses
        .filter((tuition) => tuition.course !== null)
        .map(async (tuition) => {
          const course = tuition.course!;
          const progress = await getProgress(userId, course.id);
          return {
            ...course,
            faculty: course.faculty || null,
            tutors: course.tutors,
            progress,
            tuition: {
              id: tuition.id,
              userId: tuition.userId,
              courseId: tuition.courseId,
              amount: tuition.amount,
              transactionId: tuition.transactionId,
              status: tuition.status,
              createdAt: tuition.createdAt,
              updatedAt: tuition.updatedAt,
              transId: tuition.transId,
              partyId: tuition.partyId,
              username: tuition.username,
              isActive: tuition.isActive,
              isPaid: tuition.isPaid,
            },
          };
        })
    );

    const completedCourses = courses.filter(
      (course) =>
        course.progress === 100 && course.tuition?.status === "completed"
    );
    const coursesInProgress = courses.filter(
      (course) =>
        (course.progress !== null && course.progress < 100) ||
        course.tuition?.status === "pending"
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.error(`[${new Date().toISOString()} GET_DASHBOARD_COURSES]`, error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
