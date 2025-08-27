import { db } from "@/lib/db";
import { Admin, School } from "@prisma/client";

export type AdminsWithSchool = Admin & {
  school: School | null;
  courses: { id: string }[];
};

export type GetAdmins = {
  userId: string;
  title?: string;
  adminId?: string;
  schoolId?: string;
};

export const getAdmins = async ({
  userId,
  title,
  adminId,
  schoolId,
}: GetAdmins): Promise<AdminsWithSchool[]> => {
  try {
    const admins = await db.admin.findMany({
      where: {
        userId,
        isPublished: true,
        ...(title ? { title: { contains: title, mode: "insensitive" } } : {}),
        ...(adminId ? { id: adminId } : {}),
        ...(schoolId ? { schoolId } : {}),
      },
      include: {
        school: true,
        courses: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return admins as AdminsWithSchool[];
  } catch (error) {
    console.error("[GET_ADMINS]", error);
    return [];
  }
};
