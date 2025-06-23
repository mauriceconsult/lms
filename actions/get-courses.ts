import { db } from "@/lib/db";
import { Course } from "@prisma/client";

type CoursesWithCourse = Course & {
  course: Course | null;
  tutors: { id: string }[];
};

type GetCourses = {
  userId: string;
  title?: string;
  facultyId?: string;
};
export const getCourses = async ({
  title,
  facultyId,
}: GetCourses): Promise<CoursesWithCourse[]> => {
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
    const coursesWithCourse: CoursesWithCourse[] = await Promise.all(
      courses.map(async (course) => {
        return {
          ...course,
          course: course, // add the 'course' property as required by the type
          tutors: course.tutors
            ? course.tutors.map((tutor) => ({ id: tutor.id }))
            : [],
        };
      })
    );
    return coursesWithCourse;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
