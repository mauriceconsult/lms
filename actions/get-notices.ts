import { Faculty, Noticeboard } from "@prisma/client";
import { db } from "@/lib/db";

type NoticesWithFaculty = Noticeboard & {
  faculty: Faculty | null;
  courses: { id: string }[];
};
type GetNoticeboards = {
  userId: string;
  title?: string;
  facultyId?: string;
};
export const getNoticeboards = async ({
  title,
  facultyId,
}: GetNoticeboards): Promise<NoticesWithFaculty[]> => {
  try {
    const courses = await db.noticeboard.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        facultyId,
      },
      include: {
        faculty: true,
        courses: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const coursesWithFaculty: NoticesWithFaculty[] = await Promise.all(
      courses.map(async (noticeboard) => {
        return {
          ...noticeboard,
          courses: noticeboard.courses
            ? noticeboard.courses.map((course) => ({ id: course.id }))
            : [],
        };
      })
    );
    return coursesWithFaculty;
  } catch (error) {
    console.log("[GET_NOTICES]", error);
    return [];
  }
};
