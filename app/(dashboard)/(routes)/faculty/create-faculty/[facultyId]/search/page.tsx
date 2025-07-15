// app/faculty/create-faculty/[facultyId]/search/page.tsx
import { Course, Faculty } from "@prisma/client";
import { db } from "@/lib/db";
import { FacultyCourseForm } from "../_components/faculty-course-form";

async function getFaculty(
  facultyId: string,
  search?: string
): Promise<(Faculty & { courses: Course[] }) | null> {
  "use server";
  try {
    return await db.faculty.findUnique({
      where: { id: facultyId },
      include: {
        courses: {
          where: search
            ? { title: { contains: search, mode: "insensitive" } }
            : {},
          orderBy: { position: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("Get faculty error:", error);
    return null;
  }
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { facultyId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const searchTerm =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const faculty = await getFaculty(params.facultyId, searchTerm);

  if (!faculty) {
    return <div className="text-red-500 p-6">Faculty not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Manage Faculty Courses</h1>
      <p className="text-sm text-muted-foreground mb-2">
        Faculty ID: {params.facultyId}
      </p>
      {searchTerm && (
        <p className="text-sm text-muted-foreground mb-4">
          Search Term: {searchTerm}
        </p>
      )}
      <FacultyCourseForm initialData={faculty} facultyId={params.facultyId} />
    </div>
  );
}
