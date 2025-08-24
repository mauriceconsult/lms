import { db } from "@/lib/db";
import { Course, Admin } from "@prisma/client";

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
  title,
  adminId,
}: GetCourses): Promise<CourseWithProgressWithAdmin[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
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
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    const coursesWithProgressWithAdmin: CourseWithProgressWithAdmin[] = await Promise.all(
      courses.map(async (course) => {
        return {
          ...course,
          tutors: course.tutors
            ? course.tutors.map((tutor) => ({ id: tutor.id }))
            : [],
          progress: null, // or calculate actual progress if available
        };
      })
    );
    return coursesWithProgressWithAdmin;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
