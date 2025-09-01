import { db } from "@/lib/db";
import { Admin, Course, Tutor } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithProgressWithAdmin = Course & {
  admin: Admin | null;
  tutors: Tutor[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithAdmin[];
  coursesInProgress: CourseWithProgressWithAdmin[];
};

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.tuition.findMany({
      where: {
        userId,
      },
      select: {
        course: {
          include: {
            admin: true,
            tutors: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    // Filter out null courses and map to CourseWithProgressWithAdmin
    const courses: CourseWithProgressWithAdmin[] = await Promise.all(
      purchasedCourses
        .filter((tuition) => tuition.course !== null)
        .map(async (tuition) => {
          const course = tuition.course!;
          const progress = await getProgress(userId, course.id);
          return {
            ...course,
            progress,
          };
        })
    );

    const completedCourses = courses.filter((course) => course.progress === 100);
    const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
