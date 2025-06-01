import { db } from "@/lib/db";
import { Faculty, School } from "@prisma/client";

type FacultiesWithSchool = Faculty & {
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
}: GetFaculties): Promise<FacultiesWithSchool[]> => {
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
    const facultiesWithSchool: FacultiesWithSchool[] = await Promise.all(
      faculties.map(async faculty => {
        return {
          ...faculty,
          faculties: faculty.courses ? faculty.courses.map(course => ({ id: course.id })) : [],
        }
      })
    );
    return facultiesWithSchool;

  } catch (error) {
    console.log("[GET_FACULTIES]", error);
    return [];
  }
};
