import { db } from "@/lib/db";
import { Attachment, Noticeboard } from "@prisma/client";

interface GetNoticeboardProps {
  userId: string;
  facultyId: string;
  noticeboardId: string;
}
export const getNoticeboard = async ({
  userId,
  facultyId,
  noticeboardId,
}: GetNoticeboardProps) => {
  try {   
    const faculty = await db.faculty.findUnique({
      where: {
        isPublished: true,
        id: facultyId,
      },   
    });
    const noticeboard = await db.noticeboard.findUnique({
      where: {
        id: noticeboardId,
        isPublished: true,
      },
    });
    if (!faculty || !noticeboard) {
      throw new Error("Course or Noticeboard not found");
    }
    let attachments: Attachment[] = [];
    let nextNoticeboard: Noticeboard | null = null;
    if (userId) {
      attachments = await db.attachment.findMany({
        where: {
          facultyId: facultyId,
        },
      });
    }
    if (noticeboard.userId || userId) {    
      nextNoticeboard = await db.noticeboard.findFirst({
        where: {
          facultyId: facultyId,
          isPublished: true,
          position: {
            gt: noticeboard?.position ?? 0,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    return {
      noticeboard,
      faculty,      
      attachments,
      nextNoticeboard,      
    };
  } catch (error) {
    console.log("[GET_TUTOR_ERROR]", error);
    return {
      noticeboard: null,
      faculty: null,      
      attachments: [],
      nextNoticeboard: null,        
    };
  }
};
