import {
  Course,
  Coursework,
  Tutor,
  CourseNoticeboard,
  // Admin,
} from "@prisma/client";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CourseAdminForm } from "../_components/course-admin-form";

async function getCourse(
  courseId: string,
  search?: string
): Promise<
  | (Course & {
      courseworks: Coursework[];
      tutors: Tutor[];
      courseNoticeboards: CourseNoticeboard[];
    })
  | null
> {
  "use server";
  try {
    return await db.course.findUnique({
      where: { id: courseId },
      include: {
        courseworks: {
          where: search
            ? { title: { contains: search, mode: "insensitive" } }
            : {},
          orderBy: { position: "asc" },
        },
        tutors: {
          where: search
            ? { title: { contains: search, mode: "insensitive" } }
            : {},
          orderBy: { position: "asc" },
        },
        courseNoticeboards: {
          where: search
            ? { title: { contains: search, mode: "insensitive" } }
            : {},
          orderBy: { position: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("Get course error:", error);
    return null;
  }
}

async function getAdminOptions(): Promise<{ label: string; value: string }[]> {
  "use server";
  try {
    const admins = await db.admin.findMany({
      select: { id: true, title: true },
    });
    return admins.map((admin) => ({
      label: admin.title,
      value: admin.id,
    }));
  } catch (error) {
    console.error("Get admins error:", error);
    return [];
  }
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchTerm = Array.isArray(resolvedSearchParams.search)
    ? resolvedSearchParams.search[0] // Take first element if array
    : resolvedSearchParams.search ?? ""; // Use string or fallback to ""

  const course = await getCourse((await params).courseId, searchTerm);
  const adminOptions = await getAdminOptions();

  if (!course) {
    return redirect("/");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Manage Course</h1>
      <p className="text-sm text-muted-foreground mb-2">
        Course ID: {(await params).courseId}
      </p>
      {searchTerm && (
        <p className="text-sm text-muted-foreground mb-4">
          Search Term: {searchTerm}
        </p>
      )}
      <CourseAdminForm
        initialData={course}
        courseId={(await params).courseId}
        adminId={course.adminId || ""}
        options={adminOptions}
      />
    </div>
  );
}
