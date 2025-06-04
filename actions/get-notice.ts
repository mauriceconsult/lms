import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NoticeBoard } from "@prisma/client";

interface GetNoticeProps {
  userId: string;
  facultyId: string;
  courseId: string;
}
export const getNotice = async ({ courseId, facultyId }: GetNoticeProps) => {
  try {
    const notice = await db.noticeBoard.findUnique({
      where: {
        id: courseId,
        facultyId: facultyId,
      },
    });
    if (!notice) {
      return redirect("/");
    }

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
    });

    const faculty = await db.faculty.findUnique({
      where: {
        id: facultyId,
        isPublished: true,
      },
    });
    if (!notice || !course || !faculty) {
      throw new Error("Notice, Course or Faculty not found");
    }
    let title: string | null = null;
    let imageUrl: string | null = null;
    let description: string | null = null;
    let nextNotice: NoticeBoard | null = null;
    if (notice) {
      title = notice.title;
      imageUrl = notice.imageUrl;
      description = notice.description;
    }

    if (!title) {
      return redirect("/");
    }
    if (!imageUrl) {
      imageUrl = "/default-notice-image.jpg"; // Fallback image URL
    }

    if (!description) {
      return redirect("/");
    }
    nextNotice = await db.noticeBoard.findFirst({
      where: {
        facultyId: facultyId,
        position: {
          gt: notice?.position ?? 0,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return {
      title,
      imageUrl,
      description,
      nextNotice,
      facultyId,
    };
  } catch (error) {
    console.log("[GET_NOTICE_ERROR]", error);
    return {
      title: null,
      imageUrl: null,
      description: null,
      nextNotice: null,
      facultyId: null,
    };
  }
};
