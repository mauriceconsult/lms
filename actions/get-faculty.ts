import { db } from "@/lib/db";
import { Attachment, Faculty } from "@prisma/client";

interface GetFacultyProps {
  userId: string;
  schoolId: string;
  facultyId: string;
}
export const getFaculty = async ({
  userId,
  schoolId,
  facultyId,
}: GetFacultyProps) => {
  try {   
    const school = await db.school.findUnique({
      where: {        
        id: schoolId,        
      },   
    });
    const faculty = await db.faculty.findUnique({
      where: {
        id: facultyId,
        isPublished: true,
      },
    });
    if (!school || !faculty) {
      throw new Error("School or Faculty not found");
    }
    let attachments: Attachment[] = [];
    let nextFaculty: Faculty | null = null;
    if (userId) {
      attachments = await db.attachment.findMany({
        where: {
          id: school.id,
        },
      });
    }
    if (faculty.userId || userId) {    
      nextFaculty = await db.faculty.findFirst({
        where: {
          schoolId: school.id,
          isPublished: true,
          position: {
            gt: faculty?.position ?? 0,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    // const userProgress = await db.userProgress.findUnique({
    //   where: {
    //     userId_facultyId: {
    //       userId,
    //       facultyId,
    //     },
    //   },
    // });
    return {
      faculty,
      school,      
      attachments,
      nextFaculty,
      // userProgress,    
    };
  } catch (error) {
    console.log("[GET_FACULTY_ERROR]", error);
    return {
      faculty: null,
      school: null,      
      attachments: [],
      nextFaculty: null,
      // userProgress: null,      
    };
  }
};
