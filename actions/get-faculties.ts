import { db } from "@/lib/db";
import { Faculty, School } from "@prisma/client";

type FacultiesWithSchool = Faculty & {
  school: School | null;
  courses: { id: string }[];
};

type GetFaculties = {
  userId: string;
  title?: string;
  facultyId?: string; // Changed from schoolId to facultyId
};

export const getFaculties = async ({
  userId,
  title,
  facultyId,
}: GetFaculties): Promise<FacultiesWithSchool[]> => {
  try {
    const faculties = await db.faculty.findMany({
      where: {
        userId,
        isPublished: true,
        ...(title ? { title: { contains: title, mode: "insensitive" } } : {}),
        ...(facultyId ? { id: facultyId } : {}),
      },
      include: {
        school: true,
        courses: {
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

    // No need for mapping, as Prisma returns the correct structure
    return faculties as FacultiesWithSchool[];
  } catch (error) {
    console.error("[GET_FACULTIES]", error);
    return [];
  }
};
