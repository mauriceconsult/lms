import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { CourseCard } from "@/components/course-card";

export default async function CourseListPage({
  params,
  searchParams,
}: {
  params: Promise<{ facultyId: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect(
      `/sign-in?redirect=/faculties/${(await params).facultyId}/courses/list`
    );
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  if (!isAdmin) {
    return redirect(`/faculties/${(await params).facultyId}/courses`);
  }

  const { facultyId } = await params;
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const faculty = await db.faculty.findUnique({
    where: { id: facultyId, isPublished: true },
    select: {
      title: true,
      school: { select: { name: true } },
      courses: {
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          isPublished: true,
          createdAt: true,
          tutors: {
            select: { id: true },
          },
          courseNoticeboards: {
            select: { id: true },
          },
        },
        where: {
          ...(query && { title: { contains: query, mode: "insensitive" } }),
        },
        orderBy: { title: "asc" },
      },
    },
  });

  if (!faculty) {
    return redirect("/faculties");
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
        href="/faculties"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Faculties
      </Link>
      <h1 className="text-2xl font-medium text-gray-900 mb-4">
        Courses for {faculty.title}
      </h1>
      <div className="flex gap-4 mb-6">
        <form className="flex gap-2 flex-1">
          <Input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search for courses..."
            className="w-full"
          />
          <Button type="submit">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>
      </div>
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          {query ? `Results for "${query}"` : "Available Courses"}
        </h2>
        {faculty.courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title || "Untitled Course"}
                description={course.description || "No description available"}
                imageUrl={course.imageUrl || "/mcalogo.png"}
                faculty={faculty?.title || "Unknown Faculty"}
                tutorsLength={0}
                amount={0}
                progress={null}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No courses found.</p>
        )}
      </div>
      <div className="mt-6">
        <Link href={`/faculties/${facultyId}/courses/create?role=admin`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>
      {!userId && (
        <p className="text-sm text-gray-600 mt-4">
          <Link href="/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </Link>{" "}
          to access full course details.
        </p>
      )}
    </div>
  );
}
