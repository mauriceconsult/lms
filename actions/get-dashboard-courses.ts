import { db } from "@/lib/db";
import { Course, Faculty } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithProgressWithFaculty = Course & {
  faculty: Faculty | null;
  tutors: { id: string; name: string }[];
  progress: number | null;
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
        status: "completed", // Only include completed payments
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
      },
    });

    const courses: CourseWithProgressWithFaculty[] = await Promise.all(
      purchasedCourses.map(async (tuition) => {
        const course = tuition.;
        const progress = await getProgress(userId, course.id);
        return {
          ...course,
          faculty: course.faculty || null,
          tutors: course.tutors,
          progress,
        };
      })
    );

    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = courses.filter(
      (course) => course.progress !== null && course.progress < 100
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
