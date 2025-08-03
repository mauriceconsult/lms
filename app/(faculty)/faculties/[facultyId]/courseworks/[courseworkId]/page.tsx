import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { IconBadge } from "@/components/icon-badge";
import { File, LayoutDashboard, Plus } from "lucide-react";
import Link from "next/link";

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

interface ExtendedFaculty {
  id: string;
  title: string;
  description: string | null;
  position: number | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
  schoolId: string | null;
  createdBy: string | null;
  school: { id: string; name: string } | null;
  courses: unknown[];
  courseworks: unknown[];
  noticeboards: unknown[];
  attachments: unknown[];
}

export default async function CourseworkIdPage({
  params,
}: {
  params: Promise<{ facultyId: string; courseworkId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { facultyId, courseworkId } = await params;

  let coursework = null;
  if (courseworkId !== "create") {
    coursework = await db.coursework.findUnique({
      where: { id: courseworkId },
      include: { faculty: true, attachments: true },
    });
    if (!coursework || coursework.facultyId !== facultyId) redirect("/");
  }

  const faculty = (await db.faculty.findUnique({
    where: { id: facultyId },
  })) as ExtendedFaculty | null;
  const courseworkCreatedBy = coursework?.createdBy || null;
  const facultyCreatedBy = faculty?.createdBy;
  const isFacultyAdmin =
    (await db.admin.findFirst({
      where: { facultyId: facultyId, userId: userId },
    })) !== null;
  console.log("Debug - Access Check:", {
    userId,
    facultyId,
    courseworkId,
    facultyCreatedBy,
    isFacultyAdmin,
    courseworkCreatedBy,
  });

  const isEnrolled = coursework?.courseId
    ? await db.enrollment.findFirst({
        where: { studentId: userId, courseId: coursework.courseId },
      })
    : null;

  const hasAccess =
    (courseworkId === "create" && isFacultyAdmin) ||
    courseworkCreatedBy === userId ||
    isFacultyAdmin ||
    !!isEnrolled;

  if (!hasAccess) redirect("/");
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium text-gray-900">
            {coursework.title || "Untitled Coursework"}
          </h1>
          <p className="text-sm text-gray-600">
            Faculty: {coursework.faculty?.title || "Unknown"}
          </p>
          {faculty?.imageUrl && (
            <Image
              src={faculty.imageUrl}
              alt={faculty.title || "Faculty"}
              width={300}
              height={200}
              loading="lazy"
            />
          )}
        </div>
        {isFacultyAdmin && (
          <Link
            href={`/faculties/${facultyId}/courseworks/create`}
            className="text-blue-600 hover:underline flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Create New Coursework
          </Link>
        )}
      </div>
      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Details</h2>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-6 mt-4">
            {coursework.description && (
              <p className="mt-2 text-sm text-gray-600">
                {stripHtml(coursework.description)}
              </p>
            )}
            {coursework.createdAt && (
              <p className="mt-2 text-sm text-gray-500">
                Created: {new Date(coursework.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {coursework.attachments.length > 0 && (
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Attachments</h2>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 mt-4 space-y-4">
              {coursework.attachments.map((attachment) => (
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
          </div>
        )}
        {isEnrolled && (
          <Link
            href={`/faculties/${facultyId}/courseworks/${courseworkId}/submit`}
            className="text-blue-600 hover:underline"
          >
            Submit Work
          </Link>
        )}
      </div>
    </div>
  );
}
