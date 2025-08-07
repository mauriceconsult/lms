import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard, ListChecks, File, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Banner } from "@/components/banner";
import { CourseActions } from "../(faculty)/faculties/[facultyId]/courses/[courseId]/_components/course-actions.client";

const stripHtml = (html: string) => {
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

export default async function CourseIdPage({
  params,
}: {
  params: Promise<{ facultyId: string; courseId: string }>;
}) {
  const { facultyId, courseId } = await params;

  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const course = await db.course.findUnique({
    where: { id: courseId, facultyId },
    include: {
      tutors: {
        select: { id: true, title: true, isPublished: true, createdAt: true },
        orderBy: { position: "asc" },
        where: { isPublished: true },
      },
      courseworks: {
        select: { id: true, title: true, isPublished: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        where: { isPublished: true },
      },
      courseNoticeboards: {
        select: { id: true, title: true, isPublished: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        where: { isPublished: true },
      },
    },
  });

  if (!course) {
    return redirect(`/faculties/${facultyId}`);
  }

  const hasTutors = course.tutors.length > 0;

  const initialData = {
    title: course.title,
    description: course.description,
    amount: course.amount,
    isPublished: course.isPublished,
    publishDate: course.publishDate,
  };

  return (
    <div className="p-6">
      {(!course.isPublished || !hasTutors) && (
        <Banner
          variant="warning"
          label={
            !course.isPublished
              ? "This course is unpublished. It will not be visible to students."
              : "This course requires at least one published tutor to be fully functional."
          }
        />
      )}
      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium text-gray-900">{course.title}</h1>
          {course.description && (
            <p className="text-sm text-gray-600">
              {stripHtml(course.description)}
            </p>
          )}
        </div>
        {isAdmin && (
          <CourseActions
            key={courseId + String(course.isPublished)}
            courseId={courseId}
            facultyId={facultyId}
            initialData={initialData}
          />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Tutors</h2>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 mt-4">
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={`/faculties/${facultyId}/courses/${courseId}/tutors`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View All Tutors
                </Link>
                {isAdmin && (
                  <Link
                    href={`/faculties/${facultyId}/courses/${courseId}/tutors/create`}
                  >
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Tutor
                    </Button>
                  </Link>
                )}
              </div>
              {course.tutors.length ? (
                <div className="space-y-4">
                  {course.tutors.map((tutor) => (
                    <Link
                      key={tutor.id}
                      href={`/faculties/${facultyId}/courses/${courseId}/tutors/${tutor.id}`}
                      className="block"
                    >
                      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                        <p className="text-sm font-medium text-gray-900">
                          {tutor.title || "Untitled Tutor"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(tutor.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No tutors available.</div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Assignments</h2>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 mt-4">
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={`/faculties/${facultyId}/courses/${courseId}/courseworks`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View All Assignments
                </Link>
                {isAdmin && (
                  <Link
                    href={`/faculties/${facultyId}/courses/${courseId}/courseworks/create`}
                  >
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Assignment
                    </Button>
                  </Link>
                )}
              </div>
              {course.courseworks.length ? (
                <div className="space-y-4">
                  {course.courseworks.map((coursework) => (
                    <Link
                      key={coursework.id}
                      href={`/faculties/${facultyId}/courses/${courseId}/courseworks/${coursework.id}`}
                      className="block"
                    >
                      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                        <p className="text-sm font-medium text-gray-900">
                          {coursework.title || "Untitled Assignment"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(coursework.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No assignments available.</div>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Noticeboards</h2>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 mt-4">
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={`/faculties/${facultyId}/courses/${courseId}/courseNoticeboards`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View All Noticeboards
                </Link>
                {isAdmin && (
                  <Link
                    href={`/faculties/${facultyId}/courses/${courseId}/courseNoticeboards/create`}
                  >
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Noticeboard
                    </Button>
                  </Link>
                )}
              </div>
              {course.courseNoticeboards.length ? (
                <div className="space-y-4">
                  {course.courseNoticeboards.map((courseNoticeboard) => (
                    <Link
                      key={courseNoticeboard.id}
                      href={`/faculties/${facultyId}/courses/${courseId}/courseNoticeboards/${courseNoticeboard.id}`}
                      className="block"
                    >
                      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                        <p className="text-sm font-medium text-gray-900">
                          {courseNoticeboard.title || "Untitled Noticeboard"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(
                            courseNoticeboard.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">
                  No courseNoticeboards available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
