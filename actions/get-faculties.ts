import { db } from "@/lib/db";
import { Faculty, School } from "@prisma/client";

type FacultiesWithSchool = Faculty & {
  school: School | null;
  courses: { id: string }[];
};

type GetFaculties = {
  userId: string;
  title?: string;
  facultyId?: string;
  schoolId?: string; // Add schoolId
};

export const getFaculties = async ({
  userId,
  title,
  facultyId,
  schoolId,
}: GetFaculties): Promise<FacultiesWithSchool[]> => {
  try {
    const faculties = await db.faculty.findMany({
      where: {
        userId,
        isPublished: true,
        ...(title ? { title: { contains: title, mode: "insensitive" } } : {}),
        ...(facultyId ? { id: facultyId } : {}),
        ...(schoolId ? { schoolId } : {}), // Filter by schoolId
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
    return faculties as FacultiesWithSchool[];
  } catch (error) {
    console.error("[GET_FACULTIES]", error);
    return [];
  }
};
