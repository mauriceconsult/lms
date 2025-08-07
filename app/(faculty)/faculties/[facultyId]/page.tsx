import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Banner } from "@/components/banner";
import Link from "next/link";
import { ResourceCard } from "./_components/resource-card";

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
  searchParams,
}: {
  params: Promise<{ facultyId: string }>;
  searchParams: Promise<{ role?: string; q?: string }>;
}) {
  const { facultyId } = await params;
  const { role, q } = await searchParams;
  const query = q?.trim() || "";

  const { userId } = await auth();
  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const selectedRole = role === "admin" && isAdmin ? "admin" : "student";

  const faculty = await db.faculty.findUnique({
    where: { id: facultyId, isPublished: true },
    include: {
      school: { select: { name: true } },
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
          ...(query && { title: { contains: query, mode: "insensitive" } }),
        },
        orderBy: { createdAt: "desc" },
      },
      courseworks: {
        select: {
          id: true,
          title: true,
          // imageUrl: true,
          isPublished: true,
          createdAt: true,
        },
        where: {
          isPublished: true,
          ...(query && { title: { contains: query, mode: "insensitive" } }),
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!faculty) {
    return redirect("/search");
  }

  const resources = [
    ...faculty.courses.map((course) => ({
      id: course.id,
      title: course.title || `Untitled Course`,
      type: "course" as const,
      createdAt: course.createdAt,
      imageUrl: course.imageUrl,
      description: course.description,
    })),
    ...faculty.courseworks.map((coursework) => ({
      id: coursework.id,
      title: coursework.title || `Untitled Coursework`,
      type: "coursework" as const,
      createdAt: coursework.createdAt,
      // imageUrl: coursework.imageUrl,
      description: undefined,
    })),
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {!faculty.isPublished && (
        <Banner
          variant="warning"
          label="This faculty is unpublished. It will not be visible to students."
        />
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium text-gray-900">
            {faculty.title || "Untitled Faculty"}
          </h1>
          {faculty.description && (
            <p className="text-sm text-gray-600">
              {stripHtml(faculty.description)}
            </p>
          )}
          <p className="text-sm text-gray-500">
            School: {faculty.school?.name || "Unknown School"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/faculties/${facultyId}?role=admin`}>
            <Button
              variant={selectedRole === "admin" ? "default" : "outline"}
              disabled={!isAdmin}
            >
              Admin
            </Button>
          </Link>
          <Link href={`/faculties/${facultyId}?role=student`}>
            <Button
              variant={selectedRole === "student" ? "default" : "outline"}
              disabled={isAdmin && !!userId}
            >
              Student
            </Button>
          </Link>
        </div>
      </div>
      <form className="flex gap-2 mb-6">
        <Input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search courses or courseworks..."
          className="w-full"
        />
        <Button type="submit">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          {query ? `Results for "${query}"` : "Faculty Resources"}
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
                imageUrl={"mcalogo.png"} // Placeholder image URL
                description={resource.description}
                role={selectedRole}
                facultyId={facultyId}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No resources found.</p>
        )}
      </div>
      {selectedRole === "admin" && (
        <div className="mt-6 flex gap-4">
          <Link href={`/faculties/${facultyId}/courses/create?role=admin`}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </Link>
          <Link href={`/faculties/${facultyId}/courseworks/create?role=admin`}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Coursework
            </Button>
          </Link>
        </div>
      )}
      {!userId && (
        <p className="text-sm text-gray-600 mt-4">
          <Link
            href={`/sign-in?redirect=/faculties/${facultyId}`}
            className="text-blue-600 hover:underline"
          >
            Sign in
          </Link>{" "}
          to access full faculty details.
        </p>
      )}
    </div>
  );
}
