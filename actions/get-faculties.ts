import { db } from "@/lib/db";
import { Faculty, School } from "@prisma/client";

type FacultyWithSchool = Faculty & {
  school: School | null;
  courses: { id: string }[];
};

type GetFaculties = {
  userId: string;
  title?: string;
  schoolId?: string;
};
export const getFaculties = async ({  
  title,
  schoolId,
}: GetFaculties): Promise<FacultyWithSchool[]> => {
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
    return faculties as FacultyWithSchool[];
  } catch (error) {
    console.log("[GET_FACULTIES]", error);
    return [];
  }
};
