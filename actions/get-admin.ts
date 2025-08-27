import { db } from "@/lib/db";
import { Attachment, Admin } from "@prisma/client";

interface GetAdminProps {
  userId: string;
  schoolId: string;
  adminId: string;
}
export const getAdmin = async ({
  userId,
  schoolId,
  adminId,
}: GetAdminProps) => {
  try {   
    const school = await db.school.findUnique({
      where: {        
        id: schoolId,        
      },   
    });
    const admin = await db.admin.findUnique({
      where: {
        id: adminId,
        isPublished: true,
      },
    });
    if (!school || !admin) {
      throw new Error("School or Admin not found");
    }
    let attachments: Attachment[] = [];
    let nextAdmin: Admin | null = null;
    if (userId) {
      attachments = await db.attachment.findMany({
        where: {
          id: school.id,
        },
      });
    }
    if (admin.userId || userId) {    
      nextAdmin = await db.admin.findFirst({
        where: {
          schoolId: school.id,
          isPublished: true,
          position: {
            gt: admin?.position ?? 0,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    // const userProgress = await db.userProgress.findUnique({
    //   where: {
    //     userId_adminId: {
    //       userId,
    //       adminId,
    //     },
    //   },
    // });
    return {
      admin,
      school,      
      attachments,
      nextAdmin,
      // userProgress,    
    };
  } catch (error) {
    console.log("[GET_FACULTY_ERROR]", error);
    return {
      admin: null,
      school: null,      
      attachments: [],
      nextAdmin: null,
      // userProgress: null,      
    };
  }
};
