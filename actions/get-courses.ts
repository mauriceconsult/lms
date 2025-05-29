import { Faculty, Course } from "@prisma/client";
import { getProgress } from "./get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithFaculty = Course & {
  faculty: Faculty | null;
  tutors: { id: string }[];
  progress: number | null;
};
type GetCourses = {
  userId: string;
  title?: string;
  facultyId?: string;
};
export const getCourses = async ({
  userId,
  title,
  facultyId,
}: GetCourses): Promise<CourseWithProgressWithFaculty[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        facultyId,
      },
      include: {
        faculty: true,
        tutors: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const coursesWithProgress: CourseWithProgressWithFaculty[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }
          const progressPercentage = await getProgress(userId, course.id);
          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );
    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
