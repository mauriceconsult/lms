import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IconBadge } from "@/components/icon-badge";
import { File, LayoutDashboard, ListChecks } from "lucide-react";
import { CourseSidebarItem } from "./courses/[courseId]/_components/course-sidebar-item";

// Function to strip HTML tags
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

export default async function FacultyIdPage({
  params,
}: {
  params: Promise<{ facultyId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const { facultyId } = await params;

  const faculty = await db.faculty.findUnique({
    where: {
      id: facultyId,
      isPublished: true,
    },
    include: {
      courses: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
        include: {
          tutors: {
            where: { isPublished: true },
            orderBy: { position: "asc" },
          },
          tuitions: {
            where: { userId }, // Check user's tuition status
          },
        },
      },
      courseworks: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      },
      noticeboards: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      },
      attachments: {
        orderBy: { createdAt: "desc" },
      },
      school: true,
    },
  });

  if (!faculty) {
    redirect("/");
  }

  const initialData = {
    ...faculty,
    description: faculty.description ?? "",
    imageUrl: faculty.imageUrl ?? "",
    schoolId: faculty.schoolId ?? "",
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium text-gray-900">
            {initialData.title}
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Faculty Details</h2>
              </div>
              <div className="bg-white shadow-sm rounded-lg p-6 mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {initialData.title}
                </h3>
                {initialData.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {stripHtml(initialData.description)}
                  </p>
                )}
                {initialData.school && (
                  <p className="mt-2 text-sm text-gray-600">
                    School: {initialData.school.name}
                  </p>
                )}
                {initialData.imageUrl && (
                  <div className="relative mt-4 w-full overflow-hidden aspect-[16/9] max-h-[150px]">
                    <Image
                      src={initialData.imageUrl}
                      alt={initialData.title}
                      fill
                      className="object-cover rounded-md"
                      priority={true}
                      sizes="(max-width: 1024px) 90vw, (max-width: 1200px) 45vw, 30vw"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Courses</h2>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 mt-4">
              {initialData.courses.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {initialData.courses.map((course) => {
                    const userTuition = course.tuitions[0]; // First tuition for this user
                    const isPaid = userTuition?.isPaid ?? false;
                    const hasAccess =
                      isPaid || course.tutors.some((tutor) => tutor.isFree);

                    return (
                      <Link
                        key={course.id}
                        href={`/faculties/${facultyId}/courses/${course.id}`}
                        className="block"
                      >
                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                          <h3 className="text-lg font-medium text-gray-900">
                            {course.title}
                            {!hasAccess && (
                              <span className="text-xs text-rose-700 ml-2 italic">
                                Locked
                              </span>
                            )}
                          </h3>
                          {course.description && (
                            <span className="text-sm text-gray-600 line-clamp-2">
                              {stripHtml(course.description)}
                            </span>
                          )}
                          <p className="mt-2 text-sm text-gray-500">
                            Tuition Fee:{" "}
                            {course.amount
                              ? parseFloat(course.amount).toFixed(2)
                              : "N/A"}{" "}
                            EUR
                          </p>
                          {course.tutors.map((tutor) => (
                            <CourseSidebarItem
                              key={tutor.id}
                              id={tutor.id}
                              label={tutor.title || "Untitled Tutor"}
                              isCompleted={
                                !!tutor.userProgress?.[0]?.isCompleted
                              }
                              courseId={course.id}
                              isLocked={!hasAccess && !tutor.isFree}
                              facultyId={faculty.id}
                            />
                          ))}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No published courses available.</p>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Courseworks</h2>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 mt-4">
              {initialData.courseworks.length ? (
                <div className="space-y-4">
                  {initialData.courseworks.map((coursework) => (
                    <Link
                      key={coursework.id}
                      href={`/faculties/${facultyId}/courseworks/${coursework.id}`}
                      className="block"
                    >
                      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                        <p className="text-sm font-medium text-gray-900">
                          {coursework.title || "Untitled Coursework"}
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
                <p className="text-gray-500">
                  No published courseworks available.
                </p>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Noticeboards</h2>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 mt-4">
              {initialData.noticeboards.length ? (
                <div className="space-y-4">
                  {initialData.noticeboards.map((noticeboard) => (
                    <Link
                      key={noticeboard.id}
                      href={`/faculties/${facultyId}/noticeboards/${noticeboard.id}`}
                      className="block"
                    >
                      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                        <p className="text-sm font-medium text-gray-900">
                          {noticeboard.title || "Untitled Noticeboard"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(noticeboard.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No published noticeboards available.
                </p>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Resources & Attachments</h2>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 mt-4">
              {initialData.attachments.length ? (
                <div className="space-y-4">
                  {initialData.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                        <p className="text-sm font-medium text-gray-900">
                          {attachment.name || "Unnamed Attachment"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Added:{" "}
                          {new Date(attachment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No attachments available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
