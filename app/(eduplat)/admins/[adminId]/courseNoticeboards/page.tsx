// app/(eduplat)/admins/[adminId]/courses/[courseId]/courseNoticeboards/page.tsx
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseNoticeboardList } from "@/app/(eduplat)/_components/course-coursenoticeboard-list";

export default async function CourseNoticeboardsPage({
  params,
}: {
  params: { adminId: string; courseId: string };
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const courseNoticeboards = await db.courseNoticeboard.findMany({
    where: {
      courseId: params.courseId,
      course: { adminId: params.adminId },
    },
    include: {
      course: {
        include: {
          courseNoticeboards: true, // For courseNoticeboardsLength
        },
      },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Course Noticeboards</h1>
      <CourseNoticeboardList items={courseNoticeboards} />
    </div>
  );
}
