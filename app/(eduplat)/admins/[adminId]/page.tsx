"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
// import { CourseWithProgressWithAdmin } from "@/actions/get-dashboard-courses";
import { CourseCard } from "@/app/(eduplat)/_components/course-card";
import ErrorBoundary from "@/components/error-boundary";
import { CourseWithProgressWithAdmin } from "../../types/course";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ adminId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} AdminPage] No userId, redirecting to /sign-in`
    );
    return redirect("/sign-in");
  }

  const { adminId } = await params;
  if (!adminId || typeof adminId !== "string") {
    console.log(
      `[${new Date().toISOString()} AdminPage] Invalid adminId, redirecting to /`
    );
    return redirect("/");
  }

  try {
    console.time("AdminPageQuery"); // Static label
    const faculty = await db.faculty.findUnique({
      where: { id: adminId, isPublished: true },
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
              orderBy: { position: "asc" },
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
    console.timeEnd("AdminPageQuery"); // Match static label

    if (!faculty) {
      console.log(
        `[${new Date().toISOString()} AdminPage] Admin not found for adminId: ${adminId}`
      );
      return redirect("/");
    }

    const courses: CourseWithProgressWithAdmin[] = faculty.courses.map((course) => {
      const totalTutors = course.tutors.length;
      const completedTutors = course.userProgress.filter((up) => up.isCompleted).length;
      const progress = totalTutors > 0 ? (completedTutors / totalTutors) * 100 : 0;
      const tuition = course.tuitions[0]
        ? {
            ...course.tuitions[0],
            amount: course.tuitions[0].amount,
          }
        : null;
      return {
        ...course,
        progress,
        tuition,
        userProgress: course.userProgress,
        admin: course.faculty,
      };
    });

    console.log(`[${new Date().toISOString()} AdminPage] Admin response:`, {
      adminId,
      title: faculty.title,
      courses: courses.map((c) => ({ id: c.id, title: c.title, progress: c.progress })),
    });

    return (
      <ErrorBoundary>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{faculty.title}</h1>
          <div className="mb-4">
            <span className="font-semibold">Description:</span>{" "}
            {faculty.description ?? "No description available"}
          </div>
          <h2 className="text-2xl font-semibold mb-4">Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          {courses.length === 0 && (
            <div className="text-center text-sm text-muted-foreground mt-4">
              No courses found.
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error(`[${new Date().toISOString()} AdminPage] Error:`, error);
    return (
      <ErrorBoundary>
        <div className="p-6">
          <h2 className="text-2xl font-medium">Error</h2>
          <p className="text-red-500">Failed to load admin</p>
        </div>
      </ErrorBoundary>
    );
  }
}
