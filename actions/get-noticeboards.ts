import { db } from "@/lib/db";
import { Noticeboard, Admin, Attachment } from "@prisma/client";

type NoticeboardWithRelations = Noticeboard & {
  admin: Admin | null;
  attachments: Attachment[];
};

type GetNoticeboards = {
  userId: string;
  title?: string;
  adminId?: string;
};
export const getNoticeboards = async ({
  title,
  adminId,
}: GetNoticeboards): Promise<NoticeboardWithRelations[]> => {
  try {
    const noticeboards = await db.noticeboard.findMany({
      where: {
        isPublished: true,
        title: title ? { contains: title } : undefined,
        adminId,
      },
      include: {
        admin: true,
        attachments: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return noticeboards;
  } catch (error) {
    console.log("[GET_NOTICEBOARDS]", error);
    return [];
  }
};
