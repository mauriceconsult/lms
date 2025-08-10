import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

export default async function CourseIdPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  console.log(`[${new Date().toISOString()} CourseIdPage] Route accessed:`, {
    params: await params,
  });

  const { userId } = await auth();
  if (!userId) {
    const { courseId } = await params;
    return redirect(`/sign-in?redirect=/courses/${courseId}`);
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  if (!isAdmin) {
    const { courseId } = await params;
    return redirect(`/${courseId}/tutors`);
  }

  const { courseId } = await params;

  console.log(`[${new Date().toISOString()} CourseIdPage] Fetching course:`, {
    courseId,
    userId,
  });

  const course = await db.course.findUnique({
    where: { id: courseId, isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      facultyId: true,
      tutors: {
        where: { isPublished: true },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
      courseNoticeboards: {
        where: { isPublished: true },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
      attachments: {
        select: { id: true, url: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!course) {
    console.error(
      `[${new Date().toISOString()} CourseIdPage] Course not found or not published:`,
      { courseId, userId }
    );
    return redirect(`/faculties/cmdsostg20000u5hklpxygy16/courses`);
  }

  console.log(`[${new Date().toISOString()} CourseIdPage] Course fetched:`, {
    courseId: course.id,
    title: course.title,
    facultyId: course.facultyId,
    tutors: course.tutors.length,
    courseNoticeboards: course.courseNoticeboards.length,
    attachments: course.attachments.length,
  });

  // Strip HTML tags from description
  const stripHtml = (html: string | null): string => {
    if (!html) return "No description available";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  return (
    <div className="p-6">
      <Link
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
        href={`/faculties/${course.facultyId}/courses`}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Courses
      </Link>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">
          {course.title || "Untitled Course"}
        </h1>
        <p className="text-sm text-slate-700">
          {stripHtml(course.description)}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Tutors</h2>
            </div>
            {course.tutors.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tutors available.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {course.tutors.map((tutor) => (
                  <Link
                    key={tutor.id}
                    href={`/${courseId}/tutors/${tutor.id}?role=admin`}
                    className="border rounded-md p-4 hover:bg-slate-50 transition"
                  >
                    <h3 className="font-medium">
                      {tutor.title || "Untitled Tutor"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Created: {new Date(tutor.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Noticeboards</h2>
            </div>
            {course.courseNoticeboards.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No noticeboards available.
              </p>
            ) : (
              course.courseNoticeboards.map((courseNoticeboard) => (
                <div
                  key={courseNoticeboard.id}
                  className="border rounded-md p-4"
                >
                  <h3 className="font-medium">{courseNoticeboard.title}</h3>
                  <p className="text-xs text-slate-500">
                    Created:{" "}
                    {new Date(courseNoticeboard.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Attachments</h2>
            </div>
            {course.attachments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No attachments available.
              </p>
            ) : (
              course.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border rounded-md p-4 hover:bg-slate-50 transition"
                >
                  <h3 className="font-medium">{attachment.url}</h3>
                  <p className="text-xs text-slate-500">
                    Created:{" "}
                    {new Date(attachment.createdAt).toLocaleDateString()}
                  </p>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
