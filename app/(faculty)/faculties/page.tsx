import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { FacultyCard } from "@/components/faculty-card";

export default async function FacultiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in?redirect=/faculties");
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const role = isAdmin ? "admin" : "student";

  const { q } = await searchParams;
  const query = q?.trim() || "";

  const faculties = await db.faculty.findMany({
    where: {
      isPublished: true,
      ...(query && { title: { contains: query, mode: "insensitive" } }),
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      school: { select: { name: true } },
    },
    orderBy: { title: "asc" },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-medium text-gray-900 mb-4">Faculties</h1>
      <div className="flex gap-4 mb-6">
        <form className="flex gap-2 flex-1">
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
        {isAdmin && (
          <Link href="/faculty/create-faculty?role=admin">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Faculty
            </Button>
          </Link>
        )}
      </div>
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          {query ? `Results for "${query}"` : "Available Faculties"}
        </h2>
        {faculties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculties.map((faculty) => (
              <FacultyCard
                key={faculty.id}
                id={faculty.id}
                title={faculty.title || "Untitled Faculty"}
                description={faculty.description || "No description available."}
                imageUrl={faculty.imageUrl || "/placeholder.jpg"}
                school={faculty.school?.name || "Unknown School"}
                role={role}
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
          to access full faculty details.
        </p>
      )}
    </div>
  );
}
