import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import Link from "next/link";

export default async function FacultyCourseworksPage({
  params,
}: {
  params: Promise<{ facultyId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  // Validate faculty access (e.g., ensure user is authorized)
  const faculty = await db.faculty.findUnique({
    where: { id: (await params).facultyId },
  });

  if (!faculty) {
    redirect("/");
  }

  const courseworks = await db.coursework.findMany({
    where: {
      facultyId: (await params).facultyId,
      isPublished: true,
    },
    include: {
      attachments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">      
          <div className="flex items-center justify-between w-full mt-4">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Faculty Courseworks</h1>
              <div className="text-sm text-slate-700">
                <div>{courseworks.length} courseworks available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {courseworks.map(async (coursework) => (
          <div
            key={coursework.id}
            className="space-y-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            {!coursework.isPublished && (
              <Banner
                variant="warning"
                label="This Coursework is unpublished."
              />
            )}
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">{coursework.title}</h2>
            </div>
            <p className="text-slate-600">
              {(coursework.description || "No description").substring(0, 100)}
              ...
            </p>
            <Link
              href={`/faculties/${(await params).facultyId}/courseworks/${coursework.id}`}
              className="text-blue-600 hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
