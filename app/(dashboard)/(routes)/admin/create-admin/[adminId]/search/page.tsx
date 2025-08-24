import { Course, Admin } from "@prisma/client";
import { db } from "@/lib/db";
import { AdminCourseForm } from "../../../../admin/create-admin/[adminId]/_components/admin-course-form";
import { redirect } from "next/navigation";

async function getAdmin(
  adminId: string,
  search?: string
): Promise<(Admin & { courses: Course[] }) | null> {
  "use server";
  try {
    return await db.admin.findUnique({
      where: { id: adminId },
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
    console.error("Get admin error:", error);
    return null;
  }
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ adminId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchTerm =
    typeof (await searchParams).search === "string"
      ? (await searchParams).search
      : "";
  const admin = await getAdmin((await params).adminId);

  if (!admin) {
    return redirect("/");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Manage Admin Courses</h1>
      <p className="text-sm text-muted-foreground mb-2">
        Admin ID: {(await params).adminId}
      </p>
      {searchTerm && (
        <p className="text-sm text-muted-foreground mb-4">
          Search Term: {searchTerm}
        </p>
      )}
      <AdminCourseForm
        initialData={admin}
        adminId={(await params).adminId}
      />
    </div>
  );
}
