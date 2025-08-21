import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params; // Move outside try-catch

  try {
    const { userId } = await auth();

    if (!userId) {
      console.log(
        `[${new Date().toISOString()} CourseLayout] No userId, redirecting to /`
      );
      return redirect("/");
    }

    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
      select: {
        id: true,
        title: true,
      },
    });

    if (!course) {
      console.log(
        `[${new Date().toISOString()} CourseLayout] Course not found: ${courseId}, redirecting to /dashboard`
      );
      return redirect("/dashboard");
    }

    const progress = await getProgress(userId, courseId);

    return (
      <div className="course-layout">
        <header>
          <h1>{course.title}</h1>
          <p>
            Progress:{" "}
            {progress !== null ? `${progress.toFixed(2)}%` : "Not started"}
          </p>
        </header>
        {children}
      </div>
    );
  } catch (error) {
    console.error(`[${new Date().toISOString()} CourseLayout] Error:`, {
      courseId,
      error,
    });
    return redirect("/dashboard");
  }
}
