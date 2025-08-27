import { Admin, Course } from "@prisma/client";
import { getProgress } from "./get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithAdmin = Course & {
  admin: Admin | null;
  tutors: { id: string }[];
  progress: number | null;
};

type GetCourses = {
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
          mode: "insensitive", // Case-insensitive search
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
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithAdmin[] = await Promise.all(
      courses.map(async (course) => {
        if (course.tuitions.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }
        const progress = await getProgress(userId, course.id);
        return {
          ...course,
          progress,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
