import { db } from "@/lib/db";
import { Noticeboard, Faculty, Attachment } from "@prisma/client";

type NoticeboardWithRelations = Noticeboard & {
  faculty: Faculty | null;
  attachments: Attachment[];
};

type GetNoticeboards = {
  userId: string;
  title?: string;
  facultyId?: string;
};
export const getNoticeboards = async ({
  title,
  facultyId,
}: GetNoticeboards): Promise<NoticeboardWithRelations[]> => {
  try {
    const noticeboards = await db.noticeboard.findMany({
      where: {
        isPublished: true,
        title: title ? { contains: title } : undefined,
        facultyId,
      },
      include: {
        faculty: true,
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
