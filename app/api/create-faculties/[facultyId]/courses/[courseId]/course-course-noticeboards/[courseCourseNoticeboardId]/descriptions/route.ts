// app/api/create-faculties/[facultyId]/courses/[courseId]/course-course-noticeboards/[courseCourseNoticeboardId]/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      facultyId: string;
      courseId: string;
      courseCourseNoticeboardId: string;
    }>;
  }
) {
  try {
    const body = await request.json();
    const { description } = body;

    console.log("Request body:", body);
    console.log("Params:", await params);

    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!description || description.length === 0) {
      return new Response("Missing required field: description", {
        status: 400,
      });
    }

    const { courseId, courseCourseNoticeboardId: courseCourseNoticeboardId } =
      await params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!course) {
      return new Response("Course not found or unauthorized", { status: 404 });
    }

    const updatedNoticeboard = await db.courseNoticeboard.upsert({
      where: {
        id: courseCourseNoticeboardId,
      },
      update: {
        description,
      },
      create: {
        id: courseCourseNoticeboardId,
        title: "Default Noticeboard", // Adjust based on schema
        description,
        userId,
        courseId,
      },
    });

    return new Response(JSON.stringify(updatedNoticeboard), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating noticeboard:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
