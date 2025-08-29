import { db } from "@/lib/db";
import { Admin, School, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

export type AdminWithSchool = Admin & {
  school: School | null;
  courses: Course[];
  noticeboards: { id: string }[];
  progress: number | null;
};

export type GetAdmins = {
  userId: string;
  title?: string;
  schoolId?: string;
};

export const getAdmins = async ({
  userId,
  title,
  schoolId,
}: GetAdmins): Promise<AdminWithSchool[]> => {
  try {
    const admins = await db.admin.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
          mode: "insensitive",
        },
        schoolId,
      },
      include: {
        school: true,
        courses: true,
        noticeboards: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const adminWithSchool: AdminWithSchool[] = await Promise.all(
      admins.map(async (admin) => {
        if (admin.courses.length === 0) {
          return {
            ...admin,
            progress: null,
          };
        }
        const progress = await getProgress(userId, admin.id);
        return {
          ...admin,
          progress,
        };
      })
    );

    return adminWithSchool;
  } catch (error) {
    console.log("[GET_ADMINS]", error);
    return [];
  }
};
