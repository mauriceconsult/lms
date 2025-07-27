import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Import next/image
import { IconBadge } from "@/components/icon-badge";
import { File, LayoutDashboard, ListChecks } from "lucide-react";

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
    },
  });

  if (!faculty) {
    redirect("/");
  }

  // Memoize faculty data to ensure stability
  const initialData = {
    ...faculty,
    description: faculty.description ?? "",
    imageUrl: faculty.imageUrl ?? "",
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">      

        {/* Faculty Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {initialData.title}
          </h1>
          {initialData.description && (
            <p className="mt-2 text-gray-600">{initialData.description}</p>
          )}
          {initialData.imageUrl && (
            <div className="relative mt-4 h-48 w-full">
              <Image
                src={initialData.imageUrl}
                alt={initialData.title}
                fill
                className="object-cover rounded-md"
                priority={true} // Prioritize LCP
                sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizes
              />
            </div>
          )}
        </div>

        {/* Faculty Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Courses Section */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center gap-x-2 mb-4">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl font-semibold text-gray-900">Courses</h2>
              </div>
              {initialData.courses.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {initialData.courses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/faculties/${facultyId}/courses/${course.id}`}
                      className="block"
                    >
                      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                        <h3 className="text-lg font-medium text-gray-900">
                          {course.title}
                        </h3>
                        {course.description && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {course.description}
                          </p>
                        )}
                        <p className="mt-2 text-sm text-gray-500">
                          Amount:{" "}
                          {course.amount
                            ? parseFloat(course.amount).toFixed(2)
                            : "N/A"}{" "}
                          EUR
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No published courses available.</p>
              )}
            </div>

            {/* Courseworks Section */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center gap-x-2 mb-4">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Courseworks
                </h2>
              </div>
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

          <div className="space-y-6">
            {/* Noticeboards Section */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center gap-x-2 mb-4">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Noticeboards
                </h2>
              </div>
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

            {/* Attachments Section */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center gap-x-2 mb-4">
                <IconBadge icon={File} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Resources & Attachments
                </h2>
              </div>
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
