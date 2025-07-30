import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function StudentCourseworksPage({
  params,
}: {
  params: { facultyId: string; studentId: string };
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  // Validate studentId against the authenticated userId and facultyId
  const student = await db.student.findUnique({
    where: { id: params.studentId, userId: userId },
    include: { faculty: true },
  });

  if (
    !student ||
    !student.facultyId ||
    student.facultyId !== params.facultyId
  ) {
    redirect("/");
  }

  const courseworks = await db.coursework.findMany({
    where: {
      facultyId: params.facultyId,
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
          <Link href={`/faculties/${params.facultyId}/courseworks`}>
            <Button size="sm" variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courseworks
            </Button>
          </Link>
          <div className="flex items-center justify-between w-full mt-4">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">My Courseworks</h1>
              <div className="text-sm text-slate-700">
                <div>{courseworks.length} courseworks available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {courseworks.map((coursework) => {
          const effectiveFacultyId = coursework.facultyId || params.facultyId;
          return (
            <div
              key={coursework.id}
              className="space-y-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              {!coursework.isPublished && (
                <Banner
                  variant="warning"
                  label="This Coursework is unpublished. Submission is not yet available."
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
                href={`/faculties/${effectiveFacultyId}/courseworks/${coursework.id}`}
                className="text-blue-600 hover:underline"
              >
                Submit Work
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
