"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CourseWithProgressWithFaculty } from "@/actions/get-dashboard-courses";
import { CourseCard } from "@/components/course-card";
import ErrorBoundary from "@/components/error-boundary";

export default async function FacultyPage({
  params,
}: {
  params: Promise<{ facultyId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} FacultyPage] No userId, redirecting to /sign-in`
    );
    return redirect("/sign-in");
  }

  const { facultyId } = await params;
  if (!facultyId || typeof facultyId !== "string") {
    console.log(
      `[${new Date().toISOString()} FacultyPage] Invalid facultyId, redirecting to /`
    );
    return redirect("/");
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
              select: { id: true, title: true, isFree: true },
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
              select: { isCompleted: true, isEnrolled: true },
            },
          },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!faculty) {
      console.log(
        `[${new Date().toISOString()} FacultyPage] Faculty not found for facultyId: ${facultyId}`
      );
      return redirect("/");
    }

    const courses: CourseWithProgressWithFaculty[] = faculty.courses.map((course) => {
      const totalTutors = course.tutors.length;
      const completedTutors = course.userProgress.filter((up) => up.isCompleted).length;
      const progress = totalTutors > 0 ? (completedTutors / totalTutors) * 100 : 0;
      return {
        ...course,
        progress,
        tuition: course.tuitions[0] || null,
      };
    });

    console.log(`[${new Date().toISOString()} FacultyPage] Faculty response:`, {
      facultyId,
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
    console.error(`[${new Date().toISOString()} FacultyPage] Error:`, error);
    return (
      <ErrorBoundary>
        <div className="p-6">
          <h2 className="text-2xl font-medium">Error</h2>
          <p className="text-red-500">Failed to load faculty</p>
        </div>
      </ErrorBoundary>
    );
  }
}
