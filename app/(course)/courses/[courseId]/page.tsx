import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

export default async function CourseIdPage({
  params,
}: {
  params: Promise<{ facultyId: string; courseId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect(
      `/sign-in?redirect=/faculties/${(await params).facultyId}/courses/${
        (await params).courseId
      }`
    );
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  if (!isAdmin) {
    return redirect(`/faculties/${(await params).facultyId}/courses`);
  }

  const { facultyId, courseId } = await params;

  const course = await db.course.findUnique({
    where: { id: courseId, facultyId, isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      faculty: { select: { title: true } },
      tutors: {
        select: { id: true, title: true, createdAt: true },
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      },
      courseworks: {
        select: { id: true, title: true, createdAt: true },
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      },
      courseNoticeboards: {
        select: { id: true, title: true, createdAt: true },
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!course) {
    return redirect(`/faculties/${facultyId}/courses/list`);
  }

  // Utility function to strip HTML tags
  const stripHtmlTags = (html: string | null): string => {
    if (!html) return "";
    return html
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  return (
    <div className="p-6">
      <Link
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
        href={`/faculties/${facultyId}/courses/list`}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Course List
      </Link>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">
          {course.title || "Untitled Course"}
        </h1>
        <p className="text-sm text-slate-700">
          {stripHtmlTags(course.description) || "No description available"}
        </p>
        <p className="text-sm text-slate-700">
          Faculty: {course.faculty?.title || "Unknown Faculty"}
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
              course.tutors.map((tutor) => (
                <Link
                  key={tutor.id}
                  href={`/faculties/${facultyId}/courses/${courseId}/tutors/${tutor.id}?role=admin`}
                  className="block border rounded-md p-4 hover:bg-slate-50 transition"
                >
                  <h3 className="font-medium">
                    {tutor.title || "Untitled Tutor"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Created: {new Date(tutor.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))
            )}
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Coursework</h2>
            </div>
            {course.courseworks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No coursework available.
              </p>
            ) : (
              course.courseworks.map((work) => (
                <div key={work.id} className="border rounded-md p-4">
                  <h3 className="font-medium">
                    {work.title || "Untitled Coursework"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Created: {new Date(work.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
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
                <div key={courseNoticeboard.id} className="border rounded-md p-4">
                  <h3 className="font-medium">
                    {stripHtmlTags(courseNoticeboard.title) || "Empty Notice"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Created: {new Date(courseNoticeboard.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
