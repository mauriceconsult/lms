import { db } from "@/lib/db";
import { Attachment, Tutor } from "@prisma/client";

interface GetTutorProps {
  userId: string;
  courseId: string;
  adminId: string;
  tutorId: string;
}
export const getTutor = async ({
  userId,
  courseId,
  adminId,
  tutorId,
}: GetTutorProps) => {
  try {
    const admin = await db.admin.findUnique({
      where: {
        isPublished: true,
        id: adminId,
      }
    })
    const tuition = await db.tuition.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        amount: true,
      },
    });
    const tutor = await db.tutor.findUnique({
      where: {
        id: tutorId,
        isPublished: true,
      },
    });
    if (!admin || !course || !tutor) {
      throw new Error("Faculty, Course or Tutor not found");
    }
    let muxData = null;
    let attachments: Attachment[] = [];
    let nextTutor: Tutor | null = null;
    if (tuition) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });
    }
    if (tutor.isFree || tuition) {
      muxData = await db.muxData.findUnique({
        where: {
          tutorId: tutorId,
        },
      });
      nextTutor = await db.tutor.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: tutor?.position ?? 0,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_tutorId: {
          userId,
          tutorId,
        },
      },
    });
    return {
      tutor,
      course,
      admin,
      muxData,
      attachments,
      nextTutor,
      userProgress,
      tuition,
    };
  } catch (error) {
    console.log("[GET_TUTOR_ERROR]", error);
    return {
      tutor: null,
      course: null,
      admin: null,
      muxData: null,
      attachments: [],
      nextTutor: null,
      userProgress: null,
      tuition: null,
    };
  }
};
