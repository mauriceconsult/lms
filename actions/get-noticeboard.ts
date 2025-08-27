import { db } from "@/lib/db";
import { Attachment, Noticeboard } from "@prisma/client";

interface GetNoticeboardProps {
  userId: string;
  adminId: string;
  noticeboardId: string;
}
export const getNoticeboard = async ({
  userId,
  adminId,
  noticeboardId,
}: GetNoticeboardProps) => {
  try {
    // const admin = await db.admin.findUnique({
    //   where: {
    //     isPublished: true,
    //     id: adminId,
    //   },
    // });
    const noticeboard = await db.noticeboard.findUnique({
      where: {
        id: noticeboardId,
        isPublished: true,
      },
    });
    if (!adminId || !noticeboard) {
      throw new Error("Faculty ID or Noticeboard not found");
    }
    let attachments: Attachment[] = [];
    let nextNoticeboard: Noticeboard | null = null;
    if (userId) {
      attachments = await db.attachment.findMany({
        where: {
          adminId: adminId,
        },
      });
    }
    if (noticeboard.userId || userId) {
      nextNoticeboard = await db.noticeboard.findFirst({
        where: {
          adminId: adminId,
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
      // admin,
      attachments,
      nextNoticeboard,
    };
  } catch (error) {
    console.log("[GET_NOTICEBOARD_ERROR]", error);
    return {
      noticeboard: null,
      // admin: null,
      attachments: [],
      nextNoticeboard: null,
    };
  }
};
