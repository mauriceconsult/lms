import { db } from "@/lib/db";
import { Course, Faculty } from "@prisma/client";

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
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    const coursesWithProgressWithFaculty: CourseWithProgressWithFaculty[] = await Promise.all(
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
    return coursesWithProgressWithFaculty;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
