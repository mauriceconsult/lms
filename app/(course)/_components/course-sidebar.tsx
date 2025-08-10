import { db } from "@/lib/db";

interface CourseSidebarProps {
  courseId: string;
}

interface CourseSidebarData {
  title: string | null;
  facultyId: string | null;
}

export const CourseSidebar = async ({ courseId }: CourseSidebarProps) => {
  console.log(`[${new Date().toISOString()} CourseSidebar] Fetching course:`, {
    courseId,
  });

  if (!courseId) {
    console.error(
      `[${new Date().toISOString()} CourseSidebar] Invalid courseId:`,
      { courseId }
    );
    return (
      <div className="flex flex-col h-full border-r">
        <h2 className="font-semibold p-4">Course</h2>
        <div className="flex-1">
          <p className="p-4 text-sm text-red-500">Error: Invalid course ID</p>
        </div>
      </div>
    );
  }

  const course: CourseSidebarData | null = await db.course.findUnique({
    where: { id: courseId },
    select: { title: true, facultyId: true },
  });

  console.log(`[${new Date().toISOString()} CourseSidebar] Course fetched:`, {
    courseId,
    title: course?.title,
    facultyId: course?.facultyId,
  });

  if (!course) {
    console.error(
      `[${new Date().toISOString()} CourseSidebar] Course not found:`,
      { courseId }
    );
    return (
      <div className="flex flex-col h-full border-r">
        <h2 className="font-semibold p-4">Course</h2>
        <div className="flex-1">
          <p className="p-4 text-sm text-red-500">Error: Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r">
      <h2 className="font-semibold p-4">{course.title || "Course"}</h2>
      <div className="flex-1">
        <a
          href={`/courses/${courseId}`}
          className="block p-4 hover:bg-slate-50"
        >
          Overview
        </a>
        <a href={`/${courseId}/tutors`} className="block p-4 hover:bg-slate-50">
          Tutors
        </a>
        <a
          href={`/faculties/${course.facultyId || "unknown"}/courses`}
          className="block p-4 hover:bg-slate-50"
        >
          Back to Faculty
        </a>
        <a
          href={`/${courseId}/noticeboard`}
          className="block p-4 hover:bg-slate-50"
        >
          Noticeboard
        </a>
      </div>
    </div>
  );
};
