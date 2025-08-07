import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Banner } from "@/components/banner";
import Link from "next/link";
import { CourseActions } from "./_components/course-actions.client";
import { ResourceCard } from "../../_components/resource-card";

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
  searchParams,
}: {
  params: Promise<{ facultyId: string; courseId: string }>;
  searchParams: Promise<{ role?: string; q?: string }>;
}) {
  const { facultyId, courseId } = await params;
  const { role, q } = await searchParams;
  const query = q?.trim() || "";

  const { userId } = await auth();
  if (!userId) {
    return redirect(
      `/sign-in?redirect=/faculties/${facultyId}/courses/${courseId}`
    );
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const selectedRole = role === "admin" && isAdmin ? "admin" : "student";

  const course = await db.course.findUnique({
    where: { id: courseId, facultyId },
    include: {
      tutors: {
        select: {
          id: true,
          title: true,
          isPublished: true,
          createdAt: true,
          // imageUrl: true,
        },
        where: {
          isPublished: true,
          ...(query && { title: { contains: query, mode: "insensitive" } }),
        },
        orderBy: { position: "asc" },
      },
      courseworks: {
        select: {
          id: true,
          title: true,
          isPublished: true,
          createdAt: true,
          // imageUrl: true,
        },
        where: {
          isPublished: true,
          ...(query && { title: { contains: query, mode: "insensitive" } }),
        },
        orderBy: { createdAt: "desc" },
      },
      courseNoticeboards: {
        select: {
          id: true,
          title: true,
          isPublished: true,
          createdAt: true,
          // imageUrl: true,
        },
        where: {
          isPublished: true,
          ...(query && { title: { contains: query, mode: "insensitive" } }),
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!course) {
    return redirect(`/faculties/${facultyId}`);
  }

  const hasTutors = course.tutors.length > 0;
  const resources = [
    ...course.tutors.map((tutor) => ({
      id: tutor.id,
      title: tutor.title || `Untitled Tutor`,
      type: "tutor" as const,
      createdAt: tutor.createdAt,
      // imageUrl: tutor.imageUrl,
      description: undefined,
    })),
    ...course.courseworks.map((coursework) => ({
      id: coursework.id,
      title: coursework.title || `Untitled Coursework`,
      type: "coursework" as const,
      createdAt: coursework.createdAt,
      // imageUrl: coursework.imageUrl,
      description: undefined,
    })),
    ...course.courseNoticeboards.map((courseNoticeboard) => ({
      id: courseNoticeboard.id,
      title: courseNoticeboard.title || `Untitled Noticeboard`,
      type: "courseNoticeboard" as const,
      createdAt: courseNoticeboard.createdAt,
      // imageUrl: courseNoticeboard.imageUrl,
      description: undefined,
    })),
  ];

  const initialData = {
    title: course.title,
    description: course.description,
    amount: course.amount,
    isPublished: course.isPublished,
    publishDate: course.publishDate,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium text-gray-900">
            {course.title || "Untitled Course"}
          </h1>
          {course.description && (
            <p className="text-sm text-gray-600">
              {stripHtml(course.description)}
            </p>
          )}
        </div>
        {selectedRole === "admin" && (
          <CourseActions
            key={`${courseId}-${
              course.isPublished
            }-${course.updatedAt.toISOString()}`}
            courseId={courseId}
            facultyId={facultyId}
            initialData={initialData}
          />
        )}
      </div>
      <form className="flex gap-2 mb-6">
        <Input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search tutors, assignments, or courseNoticeboards..."
          className="w-full"
        />
        <Button type="submit">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          {query ? `Results for "${query}"` : "Course Resources"}
        </h2>
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard
                key={`${resource.type}-${resource.id}`}
                id={resource.id}
                title={resource.title}
                type={resource.type}
                createdAt={resource.createdAt}
                imageUrl={"/mcalogo.png"} // Placeholder image URL
                description={resource.description}
                role={selectedRole}
                facultyId={facultyId}
                courseId={courseId}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No resources found.</p>
        )}
      </div>
      {selectedRole === "admin" && (
        <div className="mt-6 flex gap-4">
          <Link
            href={`/faculties/${facultyId}/courses/${courseId}/tutors/create?role=admin`}
          >
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Tutor
            </Button>
          </Link>
          <Link
            href={`/faculties/${facultyId}/courses/${courseId}/courseworks/create?role=admin`}
          >
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </Link>
          <Link
            href={`/faculties/${facultyId}/courses/${courseId}/courseNoticeboards/create?role=admin`}
          >
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Noticeboard
            </Button>
          </Link>
        </div>
      )}
      {!userId && (
        <p className="text-sm text-gray-600 mt-4">
          <Link
            href={`/sign-in?redirect=/faculties/${facultyId}/courses/${courseId}`}
            className="text-blue-600 hover:underline"
          >
            Sign in
          </Link>{" "}
          to access full course details.
        </p>
      )}
    </div>
  );
}
