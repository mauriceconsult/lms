import { db } from "@/lib/db";
import { Attachment, StudentProject } from "@prisma/client";

interface GetStudentProjectProps {
  userId: string;
  facultyId: string;
  courseworkId: string;
  studentProjectId: string;
}
export const getStudentProject = async ({
  userId,
  facultyId,
  courseworkId,
  studentProjectId,
}: GetStudentProjectProps) => {
  try {
    const coursework = await db.coursework.findUnique({
      where: {
        isPublished: true,
        id: courseworkId,
        facultyId
      },     
    });
    const studentProject = await db.studentProject.findUnique({
      where: {
        id: studentProjectId,
        
        isPublished: true,
        userId,
      },
    });
    if (!coursework || !studentProject) {
      throw new Error("Purchase, Course or StudentProject not found");
    }
    const attachments: Attachment[] = [];
    let nextStudentProject: StudentProject | null = null;

    if (studentProject.userId) {  
      nextStudentProject = await db.studentProject.findFirst({
        where: {
          courseworkId: courseworkId,
          isPublished: true,
          position: {
            gt: studentProject?.position ?? 0,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }  
    return {
      studentProject,
      coursework,    
      attachments,
      nextStudentProject,
    };
  } catch (error) {
    console.log("[GET_STUDENT_PROJECT_ERROR]", error);
    return {
      studentProject: null,
      coursework: null, 
      attachments: [],
      nextStudentProject: null,   
      purchase: null,
    };
  }
};
