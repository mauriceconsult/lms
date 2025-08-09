import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

const FacultyIdPage = async ({
  params,
}: {
  params: Promise<{
    facultyId: string;
  }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const resolvedParams = await params;
  const faculty = await db.faculty.findUnique({
    where: {
      id: resolvedParams.facultyId,
      isPublished: true,
    },
    include: {
      school: {
        select: {
          name: true,
        },
      },
      courses: {
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          isPublished: true,
          createdAt: true,
        },
        where: {
          isPublished: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      noticeboards: {
        select: {
          id: true,
          title: true,
          isPublished: true,
          createdAt: true,
        },
        where: {
          isPublished: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      attachments: {
        select: {
          id: true,
          name: true,
          url: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!faculty) {
    console.error(
      `[${new Date().toISOString()} FacultyIdPage] Faculty not found or not published:`,
      { facultyId: resolvedParams.facultyId, userId }
    );
    return redirect("/faculties");
  }

  return (
    <div className="p-6">
      <Link
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
        href="/faculties"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Faculties
      </Link>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">{faculty.title}</h1>
        <p className="text-sm text-slate-700">{faculty.description}</p>
        <p className="text-sm text-slate-700">School: {faculty.school?.name}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Courses</h2>
            </div>
            {faculty.courses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No courses available.
              </p>
            ) : (
              faculty.courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/faculties/${resolvedParams.facultyId}/courses/${course.id}`}
                  className="block border rounded-md p-4 hover:bg-slate-50 transition"
                >
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-slate-700 truncate">
                    {course.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))
            )}
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Noticeboards</h2>
            </div>
            {faculty.noticeboards.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No noticeboards available.
              </p>
            ) : (
              faculty.noticeboards.map((noticeboard) => (
                <div key={noticeboard.id} className="border rounded-md p-4">
                  <h3 className="font-medium">{noticeboard.title}</h3>
                  <p className="text-xs text-slate-500">
                    Created:{" "}
                    {new Date(noticeboard.createdAt).toLocaleDateString()}
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
            {faculty.attachments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No attachments available.
              </p>
            ) : (
              faculty.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border rounded-md p-4 hover:bg-slate-50 transition"
                >
                  <h3 className="font-medium">{attachment.name}</h3>
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
};

export default FacultyIdPage;
