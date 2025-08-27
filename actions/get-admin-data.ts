"use server";

// import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { CourseWithProgressWithAdmin } from "@/actions/get-dashboard-courses";

export async function getAdminData(adminId: string, userId: string): Promise<{
  admin: { id: string; title: string; description: string | null } | null;
  courses: CourseWithProgressWithAdmin[];
} | null> {
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} getAdminData] No userId, returning null`
    );
    return null;
  }

  if (!adminId || typeof adminId !== "string") {
    console.log(
      `[${new Date().toISOString()} getAdminData] Invalid adminId, returning null`
    );
    return null;
  }

  try {
    const admin = await db.admin.findUnique({
      where: { id: adminId, isPublished: true },
      include: {
        courses: {
          where: { isPublished: true },
          include: {
            admin: {
              select: {
                id: true,
                title: true,
                userId: true,
                description: true,
                imageUrl: true,
                position: true,
                isPublished: true,
                createdAt: true,
                updatedAt: true,
                schoolId: true,
              },
            },
            tutors: {
              select: { id: true, title: true, isFree: true, position: true, playbackId: true },
            },
            tuitions: {
              where: { userId },
              select: {
                id: true,
                userId: true,
                courseId: true,
                amount: true,
                status: true,
                partyId: true,
                username: true,
                transactionId: true,
                isActive: true,
                isPaid: true,
                transId: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            userProgress: {
              where: { userId },
              select: { isCompleted: true, isEnrolled: true, tutorId: true },
            },
          },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!admin) {
      console.log(
        `[${new Date().toISOString()} getAdminData] Admin not found for adminId: ${adminId}`
      );
      return null;
    }

    const courses: CourseWithProgressWithAdmin[] = admin.courses.map((course) => {
      const totalTutors = course.tutors.length;
      const completedTutors = course.userProgress.filter((up) => up.isCompleted).length;
      const progress = totalTutors > 0 ? (completedTutors / totalTutors) * 100 : 0;
      return {
        ...course,
        progress,
        tuition: course.tuitions[0] || null,
        userProgress: course.userProgress,
      };
    });

    console.log(`[${new Date().toISOString()} getAdminData] Admin response:`, {
      adminId,
      title: admin.title,
      courses: courses.map((c) => ({ id: c.id, title: c.title, progress: c.progress })),
    });

    return { admin: { id: admin.id, title: admin.title, description: admin.description }, courses };
  } catch (error) {
    console.error(`[${new Date().toISOString()} getAdminData] Error:`, error);
    return null;
  }
}
