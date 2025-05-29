import { db } from "@/lib/db";

type GetFaculties = {
  userId: string;
  title?: string;
  schoolId?: string;
};
export const getFaculties = async ({
  userId,
  title,
  schoolId,
}: GetFaculties) => {
  try {
    const faculties = await db.faculty.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        schoolId,
      },
      include: {
        school: true,
        courses: {
          where: {
            isPublished: true,
            userId,
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
    return faculties;
  } catch (error) {
    console.log("[GET_FACULTIES]", error);
  }
};
