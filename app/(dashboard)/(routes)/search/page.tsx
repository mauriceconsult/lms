import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { RoleSelector } from "./_components/role-selector";
import { FacultyCardWrapper } from "./_components/faculty-card-wrapper";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { userId } = await auth();
  const user = await currentUser();
  const initialRole = user?.publicMetadata?.role as "admin" | "student" | null;

  const { q } = await searchParams;
  const query = q?.trim() || "";

  // Fetch faculties with noticeboard count
  const faculties = await db.faculty.findMany({
    where: {
      isPublished: true,
      ...(query && { title: { contains: query, mode: "insensitive" } }),
      ...(initialRole === "student" && {
        noticeboards: {
          some: { isPublished: true },
        },
      }),
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      school: { select: { name: true } },
      _count: {
        select: {
          noticeboards: { where: { isPublished: true } },
        },
      },
    },
    take: 10,
    orderBy: { title: "asc" },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-medium text-gray-900 mb-4">
        Search Faculties
      </h1>
      <div className="flex gap-4 mb-6">
        <form className="flex gap-2 flex-1" action="/search">
          <Input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search for faculties..."
            className="w-full"
          />
          <Button type="submit">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>
        <Suspense fallback={<div>Loading role selector...</div>}>
          <RoleSelector initialRole={initialRole} />
        </Suspense>
      </div>
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          {query ? `Results for "${query}"` : "Published Faculties"}
        </h2>
        {faculties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculties.map((faculty) => (
              <FacultyCardWrapper
                key={faculty.id}
                id={faculty.id}
                title={faculty.title}
                imageUrl={faculty.imageUrl || "/placeholder.jpg"}
                description={faculty.description || ""}
                school={faculty.school?.name || "Unknown School"}
                // noticeboardsCount={faculty._count.noticeboards}
                initialRole={initialRole}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No faculties found.</p>
        )}
      </div>
      {!userId && (
        <p className="text-sm text-gray-600 mt-4">
          <Link href="/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </Link>{" "}
          to access full course details and select your role.
        </p>
      )}
    </div>
  );
}
