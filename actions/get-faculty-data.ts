"use server";

// import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { CourseWithProgressWithFaculty } from "@/actions/get-dashboard-courses";

export async function getFacultyData(facultyId: string, userId: string): Promise<{
  faculty: { id: string; title: string; description: string | null } | null;
  courses: CourseWithProgressWithFaculty[];
} | null> {
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} getFacultyData] No userId, returning null`
    );
    return null;
  }

  if (!facultyId || typeof facultyId !== "string") {
    console.log(
      `[${new Date().toISOString()} getFacultyData] Invalid facultyId, returning null`
    );
    return null;
  }

  try {
    const faculty = await db.faculty.findUnique({
      where: { id: facultyId, isPublished: true },
      include: {
        courses: {
          where: { isPublished: true },
          include: {
            faculty: {
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

    if (!faculty) {
      console.log(
        `[${new Date().toISOString()} getFacultyData] Faculty not found for facultyId: ${facultyId}`
      );
      return null;
    }

    const courses: CourseWithProgressWithFaculty[] = faculty.courses.map((course) => {
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

    console.log(`[${new Date().toISOString()} getFacultyData] Faculty response:`, {
      facultyId,
      title: faculty.title,
      courses: courses.map((c) => ({ id: c.id, title: c.title, progress: c.progress })),
    });

    return { faculty: { id: faculty.id, title: faculty.title, description: faculty.description }, courses };
  } catch (error) {
    console.error(`[${new Date().toISOString()} getFacultyData] Error:`, error);
    return null;
  }
}
